'use client';

import { useEffect, useState } from 'react';
import type { NewsPost } from './types';

export interface BookmarkEntry {
  id: number;
  title: string;
  title_en: string;
  thumb: string;
  published: string;
  offlinePost?: NewsPost;
}

const STORAGE_KEY = 'colombo-wire-bookmarks';
const CHANGE_EVENT = 'colombo-wire-bookmarks-changed';

function readAll(): BookmarkEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookmarkEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: BookmarkEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function isBookmarked(id: number): boolean {
  return readAll().some((entry) => entry.id === id);
}

export function addBookmark(entry: BookmarkEntry) {
  const current = readAll();
  if (current.some((e) => e.id === entry.id)) return;
  writeAll([entry, ...current]);
}

export function saveOfflinePost(id: number, post: NewsPost) {
  if (!post || !Array.isArray(post.content)) throw new Error('Invalid offline story');
  writeAll(readAll().map(entry => entry.id === id ? { ...entry, offlinePost: post } : entry));
}

export function removeBookmark(id: number) {
  try { localStorage.removeItem(`wire-tamil-${id}`); } catch {}
  writeAll(readAll().filter((e) => e.id !== id));
}

/**
 * Reactive list of saved stories. Re-reads on mount and whenever a
 * bookmark is added or removed anywhere in the app (or in another tab).
 */
export function useBookmarks(): BookmarkEntry[] {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);

  useEffect(() => {
    setBookmarks(readAll());
    const sync = () => setBookmarks(readAll());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return bookmarks;
}
