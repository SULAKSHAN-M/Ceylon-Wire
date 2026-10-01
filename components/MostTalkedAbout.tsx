'use client';

import Link from 'next/link';
import { TamilHeadline } from './TamilHeadline';
import type { NewsPost } from '@/lib/types';
import { useLanguage } from '@/context/LanguageProvider';
import { getBilingualText } from '@/lib/format';

export function MostTalkedAbout({ posts }: { posts: NewsPost[] }) {
  const { language } = useLanguage();

  const ranked = posts
    .map((post) => ({
      post,
      total: post.reactionList.reduce((sum, r) => sum + r.count, 0) + post.comments,
    }))
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (ranked.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Most talked about">
      <h2 className="font-display text-lg font-semibold text-ink">Most talked about</h2>
      <ol className="mt-3 divide-y divide-line">
        {ranked.map(({ post, total }, index) => {
          const title = getBilingualText(post.title, post.title_en, language);
          return (
            <li key={post.id}>
              <Link href={`/news/${post.id}`} prefetch={false} className="group flex items-baseline gap-3 py-3">
                <span className="font-display text-2xl font-semibold tabular-nums text-line group-hover:text-saffron">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-medium text-ink group-hover:text-teal">
                    <TamilHeadline id={post.id} title={post.title} title_en={post.title_en} />
                  </span>
                  <span className="text-xs text-muted">
                    {total} {total === 1 ? 'reaction' : 'reactions'}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
