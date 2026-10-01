'use client';

import { useEffect, useState } from 'react';
import { addBookmark, removeBookmark, isBookmarked, saveOfflinePost, type BookmarkEntry } from '@/lib/bookmarks';
import { BookmarkIcon, BookmarkFilledIcon } from './Icons';

export function BookmarkButton({
  entry,
  className = 'text-muted hover:text-saffron',
}: {
  entry: BookmarkEntry;
  className?: string;
}) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isBookmarked(entry.id));
    sync(); window.addEventListener('colombo-wire-bookmarks-changed', sync);
    return () => window.removeEventListener('colombo-wire-bookmarks-changed', sync);
  }, [entry.id]);

  const toggle = async (event: React.MouseEvent) => {
    event.preventDefault(); event.stopPropagation(); setMessage('');
    try {
      if (saved) { removeBookmark(entry.id); setSaved(false); return; }
      addBookmark(entry); setSaved(true); setBusy(true);
      const response = await fetch(`/api/news/${entry.id}/offline`);
      if (!response.ok) throw new Error('offline');
      const data = await response.json();
      if (isBookmarked(entry.id)) saveOfflinePost(entry.id, data.post);
      setMessage('Saved for offline reading');
    } catch { setMessage(isBookmarked(entry.id) ? 'Bookmark saved; offline copy unavailable. Open Saved to retry.' : 'Unable to save. Device storage may be full.'); }
    finally { setBusy(false); }
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={busy ? 'Saving offline copy…' : message || undefined}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved stories' : 'Save story for later'}
      className={className}
    >
      {saved ? <BookmarkFilledIcon className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
    </button>
    {message || busy ? <span role="status" className="max-w-40 text-right text-[10px] font-body leading-tight text-muted">{busy ? 'Saving…' : message}</span> : null}
    </span>
  );
}
