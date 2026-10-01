'use client';

import Image from 'next/image';
import { sourceName } from '@/lib/news-discovery';
import { TamilHeadline } from './TamilHeadline';
import Link from 'next/link';
import type { NewsPost } from '@/lib/types';
import { useLanguage } from '@/context/LanguageProvider';
import { formatPublished, getBilingualText, isRecent } from '@/lib/format';
import { SHIMMER_BLUR_DATA_URL } from '@/lib/blur';
import { ReactionBar } from './ReactionBar';
import { BreakingTag } from './BreakingTag';
import { BookmarkButton } from './BookmarkButton';

export function HeroStory({ post }: { post: NewsPost }) {
  const { language } = useLanguage();
  const excerpt = getBilingualText(post.content[0]?.data ?? '', post.content[0]?.data_en ?? '', language);

  return (
    <Link
      href={`/news/${post.id}`}
      prefetch={false}
      className="group grid gap-5 border-b border-line pb-8 md:grid-cols-5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-paper-dim md:col-span-3">
        {post.thumb ? (
          <Image
            src={post.thumb}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            placeholder="blur"
            blurDataURL={SHIMMER_BLUR_DATA_URL}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
        {isRecent(post.published) ? (
          <div className="absolute left-3 top-3">
            <BreakingTag language={language} />
          </div>
        ) : null}
        <div className="absolute right-3 top-3 rounded-full bg-paper/90 p-1.5">
          <BookmarkButton
            entry={{
              id: post.id,
              title: post.title,
              title_en: post.title_en,
              thumb: post.thumb,
              published: post.published,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center md:col-span-2">
        <time className="text-sm text-muted" dateTime={post.published}>
          {formatPublished(post.published, language)}
        </time>
        <p className="mt-2 text-xs text-muted">Source: {sourceName(post)}</p>
        <h1 className="balance mt-2 font-display text-3xl font-semibold leading-tight text-ink group-hover:text-teal sm:text-4xl">
          <TamilHeadline id={post.id} title={post.title} title_en={post.title_en} />
        </h1>
        {excerpt && language !== 'ta' ? (
          <p className="mt-3 line-clamp-3 text-base text-muted">{excerpt}</p>
        ) : null}
        <div className="mt-5">
          <ReactionBar reactions={post.reactionList} language={language} />
        </div>
      </div>
    </Link>
  );
}
