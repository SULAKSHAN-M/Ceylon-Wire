import { NextResponse } from 'next/server';
import { getLatestNews, getNewsById } from '@/lib/api';
import { tamilHeadlines } from '@/lib/ai-features';
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 1024) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    const { ids } = JSON.parse(raw);
    if (!Array.isArray(ids) || ids.length < 1 || ids.length > 10 || !ids.every(id => Number.isSafeInteger(id) && id > 0)) return NextResponse.json({ error: 'Invalid ids' }, { status: 400 });
    const latest = await getLatestNews(false).catch(() => []);
    const posts = [];
    for (const id of [...new Set<number>(ids)]) {
      const post = latest.find(p => p.id === id) || await getNewsById(String(id), false).catch(() => null);
      if (post) posts.push(post);
    }
    return NextResponse.json({ headlines: await tamilHeadlines(posts) });
  } catch { return NextResponse.json({ error: 'Translation unavailable' }, { status: 503, headers: { 'Retry-After': '60' } }); }
}
