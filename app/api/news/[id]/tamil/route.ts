import { NextResponse } from 'next/server';
import { getNewsById } from '@/lib/api';
import { translateToTamil } from '@/lib/tamil-translation';

export const maxDuration = 60;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d{1,12}$/.test(id)) return NextResponse.json({ error: 'Invalid story.' }, { status: 400 });
  try {
    // Translate only server-fetched news, and avoid an extra category-generation call.
    const post = await getNewsById(id, false);
    if (!post) return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
    const translation = await translateToTamil(post);
    return NextResponse.json({ translation }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Tamil translation is temporarily unavailable. Please try again shortly.' }, {
      status: 503, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' },
    });
  }
}
