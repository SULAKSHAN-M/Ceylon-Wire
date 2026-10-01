'use client';

import Image from 'next/image';
import { sourceName } from '@/lib/news-discovery';
import { useEffect, useState } from 'react';
import type { TamilTranslation } from '@/lib/tamil-translation';
import Link from 'next/link';
import type { NewsPost } from '@/lib/types';
import { useLanguage } from '@/context/LanguageProvider';
import { formatPublished, getBilingualText } from '@/lib/format';
import { SHIMMER_BLUR_DATA_URL } from '@/lib/blur';
import { ChevronLeftIcon, ExternalLinkIcon, BubbleIcon } from './Icons';
import { ReactionBar } from './ReactionBar';
import { BookmarkButton } from './BookmarkButton';
import { ShareButton } from './ShareButton';
import { ReadingProgress } from './ReadingProgress';
import { StoryRow } from './StoryRow';
import { ArticleSummary } from './ArticleSummary';
import { ShareCardButton } from './ShareCardButton';
import { TranslationFeedback } from './TranslationFeedback';
import { ReadingControls } from './ReadingControls';
import { isBookmarked } from '@/lib/bookmarks';

export function ArticleView({ post, related = [] }: { post: NewsPost; related?: NewsPost[] }) {
  const { language, setLanguage } = useLanguage();
  const [translated, setTranslated] = useState<{ id: number; value: TamilTranslation } | null>(null);
  const [translationError, setTranslationError] = useState(false);
  const [retry, setRetry] = useState(0);
  const tamil = translated?.id === post.id ? translated.value : null;

  useEffect(() => {
    if (language !== 'ta' || tamil) return;
    const controller = new AbortController();
    setTranslationError(false);
    fetch(`/api/news/${post.id}/tamil`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Translation unavailable');
        const data = await response.json();
        if (!data.translation || typeof data.translation.title !== 'string'
          || !Array.isArray(data.translation.paragraphs)
          || !data.translation.paragraphs.every((text: unknown) => typeof text === 'string')) {
          throw new Error('Invalid translation');
        }
        if (!controller.signal.aborted) setTranslated({ id: post.id, value: data.translation });
      })
      .catch(() => { if (!controller.signal.aborted) setTranslationError(true); });
    return () => controller.abort();
  }, [language, post.id, tamil, retry]);

  useEffect(() => {
    const saveTamil = () => { if (tamil && isBookmarked(post.id)) { try { localStorage.setItem(`wire-tamil-${post.id}`, JSON.stringify(tamil)); } catch {} } };
    saveTamil(); window.addEventListener('colombo-wire-bookmarks-changed', saveTamil);
    return () => window.removeEventListener('colombo-wire-bookmarks-changed', saveTamil);
  }, [post.id, tamil]);

  const title = language === 'ta'
    ? tamil?.title || 'தமிழ் மொழிபெயர்ப்பு'
    : getBilingualText(post.title, post.title_en, language);
  const isDropCapLanguage = language === 'en';

  return (
    <>
      <ReadingProgress />
      <article lang={language} id="main-content" className="mx-auto max-w-read px-5 py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ChevronLeftIcon className="h-4 w-4" />
          Latest
        </Link>

        <p className="mt-4 text-xs text-muted">Source: {sourceName(post)}</p>
        <h1 className={`balance mt-5 ${language === 'ta' ? 'font-body' : 'font-display'} text-3xl font-semibold leading-tight text-ink sm:text-4xl`}>
          {title}
        </h1>

        {language === 'ta' && !tamil ? (
          <div className="mt-4 text-sm text-muted" role="status">
            {translationError ? (
              <>
                <p>தமிழ் மொழிபெயர்ப்பு தற்போது கிடைக்கவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.</p>
                <div className="mt-3 flex flex-wrap gap-5">
                  <button type="button" onClick={() => setRetry(value => value + 1)} className="underline underline-offset-4 hover:text-ink">மீண்டும் முயற்சிக்கவும்</button>
                  <button type="button" onClick={() => setLanguage('en')} className="underline underline-offset-4 hover:text-ink">Read in English</button>
                </div>
              </>
            ) : <p>தமிழில் மொழிபெயர்க்கப்படுகிறது…</p>}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <time dateTime={post.published}>{formatPublished(post.published, language)}</time>
            {post.comments > 0 && (
              <span className="inline-flex items-center gap-1">
                <BubbleIcon className="h-4 w-4" />
                {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ShareButton title={title} />
            <BookmarkButton
              entry={{
                id: post.id,
                title: post.title,
                title_en: post.title_en,
                thumb: post.thumb,
                published: post.published,
              }}
              className="rounded-sm border border-line p-1.5 text-muted hover:border-ink hover:text-saffron"
            />
          </div>
        </div>

        {post.thumb ? (
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-sm bg-paper-dim">
            <Image
              src={post.thumb}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 42rem, 100vw"
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR_DATA_URL}
              className="object-cover"
            />
          </div>
        ) : null}

        <ReadingControls words={(language === 'ta' && tamil ? tamil.paragraphs.join(' ') : post.content.map(b => getBilingualText(b.data, b.data_en, language)).join(' ')).trim().split(/\s+/).filter(Boolean).length} />
        <ArticleSummary id={post.id} language={language} />
        <div className="article-body mt-8 space-y-5 leading-relaxed text-ink">
          {language === 'ta' ? tamil?.paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          )) : post.content.map((block, index) => {
            const text = getBilingualText(block.data, block.data_en, language);
            if (!text) return null;
            const isDropCap = isDropCapLanguage && index === 0;
            return (
              <p key={index} className={isDropCap ? 'drop-cap' : undefined}>
                {text}
              </p>
            );
          })}
        </div>

        <ShareCardButton id={post.id}/>
        {language === 'ta' && tamil ? <TranslationFeedback storyId={post.id}/> : null}
        <div className="mt-8">
          <ReactionBar reactions={post.reactionList} language={language} />
        </div>

        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 rounded-sm border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
        >
          Read the full story on Esana
          <ExternalLinkIcon className="h-4 w-4" />
        </a>

        {related.length > 0 ? (
          <div className="related-stories mt-14 border-t border-line pt-6">
            <h2 className="font-display text-lg font-semibold text-ink">More from the wire</h2>
            <div className="mt-2">
              {related.map((item) => (
                <StoryRow key={item.id} post={item} />
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
