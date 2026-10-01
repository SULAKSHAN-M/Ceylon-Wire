'use client';

import { useEffect, useMemo, useState } from 'react';
import type { NewsPost, WireHeadline } from '@/lib/types';
import { HeroStory } from './HeroStory';
import { StoryRow } from './StoryRow';
import { SearchBox } from './SearchBox';
import { CategoryFilter } from './CategoryFilter';
import { MostTalkedAbout } from './MostTalkedAbout';
import { WireHeadlines } from './WireHeadlines';
import { NewStoriesBanner } from './NewStoriesBanner';
import { StaleNotice } from './StaleNotice';
import { OlderStories } from './OlderStories';
import { DISTRICTS, districtsFor } from '@/lib/news-discovery';
import Link from 'next/link';
import { TopicPreferences } from './TopicPreferences';

// Group AI and known source labels together without changing upstream data.
function topicFor(post: NewsPost): number | null {
  if (post.aiCategory !== undefined) return post.aiCategory;
  return post.category !== null && post.category >= 1 && post.category <= 10
    ? post.category + 100 : post.category;
}

export function NewsFeed({
  posts,
  wireHeadlines = [],
  stale = false,
  staleSince = null,
}: {
  posts: NewsPost[];
  wireHeadlines?: WireHeadline[];
  stale?: boolean;
  staleSince?: number | null;
}) {
  const [preferred, setPreferred] = useState<number[]>([]);
  const [onlyPreferred, setOnlyPreferred] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wire-topics') || '{}');
      if (Array.isArray(saved.topics)) { const topics = saved.topics.filter((n: unknown) => typeof n === 'number' && n >= 101 && n <= 110); setPreferred(topics); setOnlyPreferred(!!saved.active && topics.length > 0); }
    } catch {}
  }, []);
  const savePreferences = (topics: number[], active: boolean) => {
    const enabled = active && topics.length > 0;
    setPreferred(topics); setOnlyPreferred(enabled);
    try { localStorage.setItem('wire-topics', JSON.stringify({ topics, active: enabled })); } catch {}
  };
  const [district,setDistrict] = useState('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<number | 'all'>('all');

  const categories = useMemo(() => {
    const found = new Set<number>();
    for (const post of posts) {
      const topic = topicFor(post);
      if (topic !== null) found.add(topic);
    }
    return Array.from(found).sort((a, b) => a - b);
  }, [posts]);

  const byCategory = useMemo(
    () => posts.filter(post => (category === 'all' || topicFor(post) === category) && (!onlyPreferred || preferred.includes(topicFor(post) ?? -1)) && (district === 'all' || (district === 'unknown' ? !districtsFor(post).length : districtsFor(post).includes(district)))),
    [posts, category, onlyPreferred, preferred, district],
  );

  const isSearching = query.trim().length > 0;
  const filtered = useMemo(() => {
    if (!isSearching) return null;
    const q = query.trim().toLowerCase();
    return byCategory.filter(
      (post) => post.title_en.toLowerCase().includes(q) || post.title.toLowerCase().includes(q),
    );
  }, [isSearching, query, byCategory]);

  const isFiltering = category !== 'all' || isSearching || onlyPreferred || district !== 'all';

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <div>
        {posts.length === 0 ? (
          <div className="border-b border-line py-16 text-center text-muted">
            <p>No stories are coming through right now. Check back shortly.</p>
          </div>
        ) : (
          <>
            {stale ? <StaleNotice staleSince={staleSince} /> : <NewStoriesBanner currentTopId={posts[0]?.id} />}
            <TopicPreferences selected={preferred} active={onlyPreferred} onChange={topics => savePreferences(topics, onlyPreferred)} onActive={active => savePreferences(preferred, active)} />
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <label className="text-sm">District <select value={district} onChange={e=>setDistrict(e.target.value)} className="ml-2 border border-line bg-paper px-2 py-1"><option value="all">All districts</option>{DISTRICTS.map(d=><option key={d}>{d}</option>)}<option value="unknown">Not identified</option></select></label>
              <Link href="/coverage" className="text-sm underline underline-offset-4">Grouped coverage &amp; timelines</Link>
            </div>
            {district !== 'all' ? <p className="mb-3 text-xs text-muted">Based on district names mentioned in the report, not a verified incident location.</p> : null}
            <SearchBox value={query} onChange={setQuery} />
            <div className="mt-4">
              <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
            </div>

            {isFiltering ? (
              <div>
                {(filtered ?? byCategory).length === 0 ? (
                  <p className="py-10 text-center text-muted">
                    {isSearching
                      ? <>No stories match &ldquo;{query}&rdquo;.</>
                      : 'No stories in this category right now.'}
                  </p>
                ) : (
                  <div>
                    {(filtered ?? byCategory).map((post) => (
                      <StoryRow key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <HeroStory post={posts[0]} />
                <div className="mt-2 grid gap-x-10 sm:grid-cols-2">
                  {posts.slice(1).map((post) => (
                    <StoryRow key={post.id} post={post} />
                  ))}
                </div>
                {/* Walking backward by id for older stories isn't meaningful
                    while we're already serving a cached snapshot. */}
                {!stale ? <OlderStories startBefore={posts[posts.length - 1].id} /> : null}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar renders independently of the Esana feed's state — a
          NewsData headline or a ranked story shouldn't disappear just
          because the other source is temporarily empty. */}
      <div className="space-y-10 lg:border-l lg:border-line lg:pl-8 lg:pt-1">
        <MostTalkedAbout posts={posts} />
        <WireHeadlines headlines={wireHeadlines} />
      </div>
    </div>
  );
}
