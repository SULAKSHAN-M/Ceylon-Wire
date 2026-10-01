import type { WireHeadline } from './types';
import { reportFailure, reportSuccess, reportUnconfigured } from './status';

const NEWSDATA_URL = 'https://newsdata.io/api/1/latest';

// The country=lk filter alone let through unrelated wire content from
// regionally-tagged sources — e.g. Channel NewsAsia stories about the
// White House press pool showed up under "Sri Lanka" news. Restricting to
// specific, genuinely Sri Lankan domains (NewsData allows up to 5) fixes
// that. No confirmed-good domain list for Tamil-language SL outlets yet,
// so Tamil still falls back to the looser country filter for now.
const SRI_LANKAN_DOMAINS = 'adaderana.lk,ft.lk,newsfirst.lk,dailymirror.lk,economynext.com';

interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  description: string | null;
  source_name: string | null;
  pubDate: string;
}

interface NewsDataResponse {
  status: string;
  results?: NewsDataArticle[];
}

async function fetchHeadlines(
  apiKey: string,
  language: 'en' | 'ta',
): Promise<WireHeadline[]> {
  try {
    const params = new URLSearchParams({ country: 'lk', language, apikey: apiKey });
    if (language === 'en') {
      params.set('domainurl', SRI_LANKAN_DOMAINS);
    }

    const res = await fetch(`${NEWSDATA_URL}?${params.toString()}`, {
      next: { revalidate: 900 },
    });
    const data: NewsDataResponse = await res.json();

    if (!res.ok || data.status !== 'success' || !data.results) {
      console.warn(
        `[newsdata:${language}] headlines unavailable — status`,
        res.status,
        JSON.stringify(data).slice(0, 400),
      );
      return [];
    }

    return data.results.slice(0, 8).map((article) => ({
      id: article.article_id,
      title: article.title,
      link: article.link,
      description: article.description,
      sourceName: article.source_name,
      publishedAt: article.pubDate,
      language,
    }));
  } catch (err) {
    console.warn(`[newsdata:${language}] fetch threw:`, err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * Fetches current Sri Lankan headlines from NewsData.io — a second,
 * independent source alongside the Esana feed, so a rate limit or outage
 * on one doesn't take down the other. Pulls both English and Tamil
 * editions, since Esana itself has no Tamil content at all.
 *
 * Requires a free API key: sign up at https://newsdata.io/register and set
 * NEWSDATA_API_KEY. If it's not set, or a request fails for any reason,
 * that language's headlines simply don't render — this never throws.
 */
export async function getSriLankaHeadlines(): Promise<WireHeadline[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    const message = 'NEWSDATA_API_KEY is not set — headlines panel disabled. ' +
      'Check that it is in .env.local at the project root and that the dev server was restarted after adding it.';
    console.warn(`[newsdata] ${message}`);
    reportUnconfigured('newsdata', message);
    return [];
  }

  const [english, tamil] = await Promise.all([
    fetchHeadlines(apiKey, 'en'),
    fetchHeadlines(apiKey, 'ta'),
  ]);

  if (english.length > 0 || tamil.length > 0) {
    reportSuccess('newsdata');
  } else {
    reportFailure('newsdata', 'Both language requests returned no results.');
  }

  return [...english, ...tamil];
}
