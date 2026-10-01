import type { Metadata } from 'next';
import { getLatestNews } from '@/lib/api';
import type { NewsPost } from '@/lib/types';
import { readAICache, writeAICache } from '@/lib/ai-cache';
import { StoryRow } from '@/components/StoryRow';
export const metadata: Metadata = { title: 'Daily digest' };
export const dynamic = 'force-dynamic';
export default async function DigestPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const { date } = await searchParams;
  const selected = date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && date <= today ? date : today;
  const latest = await getLatestNews().catch(() => []);
  const days = [...new Set(latest.map(p => p.published.slice(0, 10)).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)))];
  for (const day of days) {
    const old = await readAICache<NewsPost[]>(`digest-${day}`) || [];
    const merged = new Map(old.map(p => [p.id, p]));
    latest.filter(p => p.published.startsWith(day)).forEach(p => merged.set(p.id, p));
    await writeAICache(`digest-${day}`, [...merged.values()].slice(-300));
  }
  const archived = await readAICache<NewsPost[]>(`digest-${selected}`) || [];
  const stories = [...new Map([...archived, ...latest.filter(p => p.published.startsWith(selected))].map(p => [p.id, p])).values()]
    .sort((a, b) => b.published.localeCompare(a.published));
  return <main id="main-content" className="mx-auto max-w-read px-5 py-12">
    <p className="text-xs uppercase tracking-[0.14em] text-muted">The daily edition</p>
    <h1 className="mt-3 font-display text-3xl font-semibold">Daily digest</h1>
    <p className="mt-3 text-sm text-muted">{selected} · Sri Lanka time · {stories.length} collected stories</p>
    <form className="my-6 flex flex-wrap items-end gap-3">
      <label className="text-sm">Choose a date<input type="date" name="date" defaultValue={selected} max={today} className="mt-2 block border border-line bg-paper px-3 py-2" required /></label>
      <button className="border border-ink px-4 py-2 text-sm">View digest</button>
    </form>
    <p className="mb-8 text-xs text-muted">A collection from available feeds, newest first. Dates are archived when this page is visited; earlier days may be incomplete or unavailable. Archives are kept for 30 days.</p>
    {stories.length ? stories.map(post => <StoryRow key={post.id} post={post} />) : <p className="border-t border-line py-8 text-muted">No stories have been collected for this date.</p>}
  </main>;
}
