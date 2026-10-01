import { NextResponse } from 'next/server';
import { getNewsById } from '@/lib/api';
import type { NewsPost } from '@/lib/types';

/**
 * The upstream API only exposes "latest" and "by id" — there's no history or
 * pagination endpoint. Since ids are sequential, we walk backward from the
 * oldest id currently on screen, one request at a time (sequential, not
 * parallel, on purpose: this API rate-limits hard, and a burst of concurrent
 * requests is exactly what caused the last lockout).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const before = Number(searchParams.get('before'));
  const limit = Math.min(Number(searchParams.get('limit')) || 5, 8);

  if (!Number.isFinite(before) || before <= 1) {
    return NextResponse.json({ posts: [], nextBefore: null, hitError: false });
  }

  const posts: NewsPost[] = [];
  let cursor = before - 1;
  let hitError = false;
  const maxAttempts = limit * 3; // allow for a handful of missing/deleted ids
  let attempts = 0;

  while (posts.length < limit && attempts < maxAttempts && cursor > 0) {
    try {
      const post = await getNewsById(String(cursor));
      if (post) posts.push(post);
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : '';
      if (message.includes('rate limit') || message.includes('429')) {
        hitError = true;
        break;
      }
      // otherwise this id just doesn't exist (deleted/skipped) — keep walking
    }
    cursor -= 1;
    attempts += 1;
  }

  return NextResponse.json({
    posts,
    nextBefore: cursor > 0 && !hitError ? cursor : null,
    hitError,
  });
}
