'use client';

import { useState } from 'react';
import type { NewsPost } from '@/lib/types';
import { StoryRow } from './StoryRow';

export function OlderStories({ startBefore }: { startBefore: number }) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [before, setBefore] = useState<number | null>(startBefore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadMore = async () => {
    if (before === null || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/news/older?before=${before}&limit=5`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setBefore(data.nextBefore ?? null);
      if (data.hitError) setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {posts.length > 0 ? (
        <div className="grid gap-x-10 sm:grid-cols-2">
          {posts.map((post) => (
            <StoryRow key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 text-center text-sm text-muted">
          Couldn&rsquo;t load older stories right now. The Esana API may be rate-limited, try
          again in a few minutes.
        </p>
      ) : null}

      {before !== null && !error ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load older stories'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
