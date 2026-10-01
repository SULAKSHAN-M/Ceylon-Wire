'use client';

import Link from 'next/link';
import { useBookmarks } from '@/lib/bookmarks';

export function SavedNavLink() {
  const bookmarks = useBookmarks();

  return (
    <Link href="/saved" className="text-sm text-muted hover:text-ink">
      Saved{bookmarks.length > 0 ? ` (${bookmarks.length})` : ''}
    </Link>
  );
}
