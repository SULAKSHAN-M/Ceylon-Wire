'use client';

import Image from 'next/image';
import { sourceName } from '@/lib/news-discovery';
import { TamilHeadline } from './TamilHeadline';
import Link from 'next/link';
import type { NewsPost } from '@/lib/types';
import { useLanguage } from '@/context/LanguageProvider';
import { formatPublished, getBilingualText, isRecent } from '@/lib/format';
import { SHIMMER_BLUR_DATA_URL } from '@/lib/blur';
import { BreakingTag } from './BreakingTag';
import { BookmarkButton } from './BookmarkButton';

export function StoryRow({ post }: { post: NewsPost }) {
  const { language } = useLanguage();
  const totalReactions = post.reactionList.reduce((sum, r) => sum + r.count, 0);

  return (
    <Link
      href={`/news/${post.id}`}
      prefetch={false}
      className="group flex gap-4 border-b border-line py-5 first:pt-0"
    >
      <div className="relative aspect-[4/3] w-24 flex-none overflow-hidden rounded-sm bg-paper-dim sm:w-32">
        {post.thumb ? (
          <Image
            src={post.thumb}
            alt=""
            fill
            sizes="128px"
            placeholder="blur"
            blurDataURL={SHIMMER_BLUR_DATA_URL}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <span className="flex items-center gap-2">
            {isRecent(post.published) ? <BreakingTag language={language} /> : null}
            <time className="text-xs text-muted" dateTime={post.published}>
              {formatPublished(post.published, language)}
            </time>
          </span>
          <BookmarkButton
            entry={{
              id: post.id,
              title: post.title,
              title_en: post.title_en,
              thumb: post.thumb,
              published: post.published,
            }}
            className="flex-none text-muted hover:text-saffron"
          />
        </div>
        <p className="mt-1 text-xs text-muted">Source: {sourceName(post)}</p>
        <h2 className="balance mt-1 font-display text-lg font-medium leading-snug text-ink group-hover:text-teal">
          <TamilHeadline id={post.id} title={post.title} title_en={post.title_en} />
        </h2>
        <p className="mt-1 flex gap-4 text-sm text-muted">
          {totalReactions > 0 && (
            <span>
              {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
            </span>
          )}
          {post.comments > 0 && (
            <span>
              {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
