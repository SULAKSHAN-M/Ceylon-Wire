'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useBookmarks, removeBookmark, saveOfflinePost } from '@/lib/bookmarks';
import { useLanguage } from '@/context/LanguageProvider';
import { formatPublished, getBilingualText } from '@/lib/format';
import { SHIMMER_BLUR_DATA_URL } from '@/lib/blur';
import { BookmarkFilledIcon } from '@/components/Icons';

export default function SavedPage() {
  const bookmarks = useBookmarks();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const download = async (id: number) => {
    setBusy(id); setMessage('');
    try { const response = await fetch(`/api/news/${id}/offline`); if (!response.ok) throw new Error(); const data = await response.json(); saveOfflinePost(id, data.post); setMessage('Offline copy saved.'); }
    catch { setMessage('Could not save an offline copy. Check your connection and device storage.'); }
    finally { setBusy(null); }
  };
  const { language } = useLanguage();

  return (
    <main id="main-content" className="mx-auto max-w-wire px-5 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Saved stories</h1>
      <p className="mt-1 text-sm text-muted">
        Kept on this device only. Tap the bookmark icon on any story to add or remove it here.
      </p>

      <p className="mt-3 text-sm"><a href="/offline.html" className="underline underline-offset-4">Open offline library</a></p>
      {message ? <p role="status" className="mt-3 text-sm text-muted">{message}</p> : null}
      {bookmarks.length === 0 ? (
        <p className="mt-10 text-center text-muted">
          Nothing saved yet. Look for the bookmark icon on any story.
        </p>
      ) : (
        <div className="mt-8">
          {bookmarks.map((entry) => {
            const title = getBilingualText(entry.title, entry.title_en, language);
            return (
              <div key={entry.id} className="group flex gap-4 border-b border-line py-5 first:pt-0">
                <Link
                  href={`/news/${entry.id}`}
                  className="relative aspect-[4/3] w-24 flex-none overflow-hidden rounded-sm bg-paper-dim sm:w-32"
                >
                  {entry.thumb ? (
                    <Image
                      src={entry.thumb}
                      alt=""
                      fill
                      sizes="128px"
                      placeholder="blur"
                      blurDataURL={SHIMMER_BLUR_DATA_URL}
                      className="object-cover"
                    />
                  ) : null}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <time className="text-xs text-muted">
                    {formatPublished(entry.published, language)}
                  </time>
                  <Link
                    href={`/news/${entry.id}`}
                    className="mt-1 font-display text-lg font-medium leading-snug text-ink hover:text-teal"
                  >
                    {title}
                  </Link>
                  {entry.offlinePost ? <a href={`/offline.html?id=${entry.id}`} className="mt-2 text-xs text-muted underline">Read offline copy</a> : <button type="button" disabled={busy !== null} onClick={() => download(entry.id)} className="mt-2 self-start text-xs text-muted underline">{busy === entry.id ? 'Saving…' : 'Save full story offline'}</button>}
                </div>
                <button
                  type="button"
                  onClick={() => removeBookmark(entry.id)}
                  aria-label="Remove from saved stories"
                  className="flex-none self-start text-saffron"
                >
                  <BookmarkFilledIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
