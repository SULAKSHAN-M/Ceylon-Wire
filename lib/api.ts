import { applyCorrections } from './editorial';
import { categorizeNews } from './gemini-categories';
import type { ContentBlock, NewsPost, ReactionItem } from './types';
import { reportFailure, reportSuccess } from './status';

const BASE_URL = 'https://esana-api.vercel.app';

/** Returns the first defined, non-null value among the given keys. */
function pick<T = unknown>(obj: any, keys: string[], fallback: T): T {
  if (!obj || typeof obj !== 'object') return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
}

const BARE_MEDIA_URL = /^https?:\/\/\S+\.(jpe?g|png|gif|webp|bmp|svg)$/i;

/**
 * Content blocks have shown up both as plain strings and as {data, type,
 * options} objects. Some blocks are images (type: 'image'), not paragraph
 * text — their `data` is a bare media URL, which would otherwise render
 * as a raw link in the middle of an article. Skip anything that isn't a
 * text block, plus a defensive check on the text itself in case a media
 * block ever shows up mislabeled.
 */
function extractTexts(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .map((block) => {
      if (typeof block === 'string') return block;
      const type = (block as any)?.type;
      if (type !== undefined && type !== 'text') return null; // image/media/etc. blocks
      return (block as any)?.data ?? null;
    })
    .filter((text): text is string => typeof text === 'string' && text.trim().length > 0)
    .filter((text) => !BARE_MEDIA_URL.test(text.trim()));
}

/**
 * Normalizes a raw post from the upstream API — old shape (Posts, flat
 * content[] with data/data_en pairs, likes/reactionList) or the newer V4
 * shape (data[], separate content/contentEn arrays, commentCounts, etc.)
 * — into the stable internal NewsPost shape the rest of the app uses.
 *
 * Field names for id/title/thumb/link/published/reactions on the *new*
 * shape are still unconfirmed (the upstream rate limit has made it hard
 * to capture one full, untruncated response) — this tries several
 * plausible candidates per field and simply omits what it can't find,
 * rather than guessing wrong and breaking the whole post.
 */
function normalizePost(raw: any): NewsPost | null {
  const id = pick<number | string | undefined>(raw, ['id', 'news_id', 'ID', 'newsId'], undefined);
  if (id === undefined) return null;

  const titleSi = pick(raw, ['title', 'TITLE'], '');
  const titleEn = pick(raw, ['title_en', 'titleEn', 'TITLE_EN'], titleSi);

  const siTexts = extractTexts(pick(raw, ['content', 'contentSi', 'contentSin'], []));
  const enTexts = extractTexts(pick(raw, ['contentEn', 'content_en'], []));
  const blockCount = Math.max(siTexts.length, enTexts.length, 1);
  const content: ContentBlock[] = Array.from({ length: blockCount }, (_, i) => ({
    data: siTexts[i] ?? enTexts[i] ?? '',
    data_en: enTexts[i] ?? siTexts[i] ?? '',
  })).filter((block) => block.data || block.data_en);

  const rawReactions = pick<unknown>(raw, ['reactionList'], null);
  let reactionList: ReactionItem[];
  if (Array.isArray(rawReactions)) {
    reactionList = rawReactions as ReactionItem[];
  } else {
    const likes = pick<number>(raw, ['likes'], 0);
    reactionList = likes > 0 ? [{ id: 1, text: 'like', count: likes }] : [];
  }

  const comments = pick<number>(raw, ['comments'], 0)
    || (pick<any>(raw, ['commentCounts'], null)
      ? (pick(raw.commentCounts, ['eng'], 0) + pick(raw.commentCounts, ['sin'], 0))
      : 0);

  const categoryRaw = pick<number | string | undefined>(raw, ['category', 'category_id', 'categoryId'], undefined);
  const category = categoryRaw === undefined ? null : Number(categoryRaw);

  return {
    id: Number(id),
    title: titleSi,
    title_en: titleEn,
    thumb: pick(raw, ['thumb', 'thumbnail', 'image', 'cover', 'COVER'], ''),
    link: pick(raw, ['link', 'url', 'URL', 'news_url'], ''),
    published: pick(raw, ['published', 'date', 'PUBLISHED'], ''),
    comments,
    reactionList,
    content,
    category,
    sourceName: 'Esana / Helakuru',
  };
}

function normalizePosts(raw: any): NewsPost[] {
  const list = pick<any[]>(raw, ['Posts', 'data', 'posts', 'results'], []);
  if (!Array.isArray(list)) return [];
  return list
    .map(normalizePost)
    .filter((post): post is NewsPost => post !== null);
}

async function fetchEsana(path: string, revalidate: number): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate } });
  const raw = await res.text();

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    reportFailure('esana', 'Esana API returned a non-JSON response.');
    throw new Error('Esana API returned a non-JSON response.');
  }

  if (!res.ok || data?.Status?.success === false) {
    const message = data?.Status?.description || `Esana API responded with ${res.status}`;
    reportFailure('esana', message);
    throw new Error(message);
  }

  reportSuccess('esana');
  return data;
}

export async function getLatestNews(categorize = true): Promise<NewsPost[]> {
  const data = await fetchEsana('/EsanaV4', 300);
  const posts = normalizePosts(data);

  if (posts.length === 0) {
    console.warn('[esana] normalized to zero posts — the shape guesses in lib/api.ts may be off.');
  }

  return applyCorrections(categorize ? await categorizeNews(posts) : posts);
}

// --- Stale-data fallback -----------------------------------------------
//
// Module-level, in-memory only (resets on server restart — fine for a
// single-process app; swap for a small file or KV store if this ever runs
// as multiple serverless instances). Whenever a live fetch genuinely
// succeeds, its result is remembered; if a later fetch fails for any
// reason, the last good result is served instead of an empty page, with
// a flag so the UI can say so honestly.

let lastGoodPosts: NewsPost[] | null = null;
let lastGoodAt: number | null = null;

export interface LatestNewsResult {
  posts: NewsPost[];
  stale: boolean;
  staleSince: number | null;
}

export async function getLatestNewsResilient(): Promise<LatestNewsResult> {
  try {
    const posts = await getLatestNews();
    if (posts.length > 0) {
      lastGoodPosts = posts;
      lastGoodAt = Date.now();
    }
    return { posts, stale: false, staleSince: null };
  } catch (err) {
    if (lastGoodPosts && lastGoodAt) {
      console.warn(
        '[esana] live fetch failed, serving cached stories from',
        new Date(lastGoodAt).toISOString(),
        '—', err instanceof Error ? err.message : err,
      );
      return { posts: lastGoodPosts, stale: true, staleSince: lastGoodAt };
    }
    throw err; // nothing to fall back to — let the normal error page show
  }
}

/**
 * Looks up a single post by id. Checks the already-fetched "latest" list
 * first — free, since every page already fetches it and Next.js dedupes
 * identical requests within one page render — and only falls back to a
 * fresh by-id request if the story isn't in that window (e.g. it's older
 * than the current latest batch, from "Load older stories"). This turns
 * the common case — clicking a story straight off the home page — into
 * zero extra upstream requests instead of one, which matters a lot given
 * how aggressively this API rate-limits.
 */
export async function getPost(id: string): Promise<NewsPost | null> {
  const numericId = Number(id);
  let latest: NewsPost[] = [];

  try {
    latest = await getLatestNews();
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : '';
    if (message.includes('rate limit') || message.includes('429')) {
      // Still try the stale cache before giving up entirely.
      if (lastGoodPosts) {
        const found = lastGoodPosts.find((post) => post.id === numericId);
        if (found) return found;
      }
      throw err; // already rate-limited — don't compound it with another request
    }
    // otherwise fall through and try a direct lookup below
  }

  const found = latest.find((post) => post.id === numericId);
  if (found) return found;

  return getNewsById(id);
}

export async function getNewsById(id: string, categorize = true): Promise<NewsPost | null> {
  let data: any;
  try {
    data = await fetchEsana(`/EsanaV4/GetNewsById?id=${encodeURIComponent(id)}`, 600);
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : '';
    if (message.includes('rate limit') || message.includes('429')) {
      throw err; // don't retry a second path while already rate-limited
    }
    // otherwise this id may only exist under the old V3 by-id path — try that
    data = await fetchEsana(`/EsanaV3/GetNewsById?id=${encodeURIComponent(id)}`, 600);
  }

  const posts = normalizePosts(data);
  return (await applyCorrections(categorize ? await categorizeNews(posts.slice(0, 1)) : posts))[0] ?? null;
}
