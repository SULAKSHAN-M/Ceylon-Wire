'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const POLL_MS = 300_000;

export function NewStoriesBanner({ currentTopId }: { currentTopId?: number }) {
  const router = useRouter();
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    if (currentTopId === undefined) return;

    const check = async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const latestId = data.posts?.[0]?.id;
        if (typeof latestId === 'number' && latestId !== currentTopId) {
          setHasUpdate(true);
        }
      } catch {
        // upstream hiccup — just try again on the next interval
      }
    };

    const interval = window.setInterval(check, POLL_MS);
    return () => window.clearInterval(interval);
  }, [currentTopId]);

  if (!hasUpdate) {
    return null;
  }

  return (
    <div
      role="status"
      className="animate-banner-in mb-6 flex items-center justify-between gap-4 rounded-sm border border-teal/30 bg-teal/5 px-4 py-3 text-sm"
    >
      <span className="text-ink">New stories have come in.</span>
      <button
        type="button"
        onClick={() => {
          setHasUpdate(false);
          router.refresh();
        }}
        className="flex-none rounded-full bg-teal px-3 py-1 font-medium text-paper hover:bg-teal/90"
      >
        Refresh
      </button>
    </div>
  );
}
