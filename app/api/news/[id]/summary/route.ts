import { NextResponse } from 'next/server';
import { getNewsById } from '@/lib/api';
import { summarize } from '@/lib/ai-features';
export const maxDuration = 60;
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const language = new URL(request.url).searchParams.get('language') || 'en';
  if (!/^\d{1,12}$/.test(id) || !['en', 'si', 'ta'].includes(language)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  try {
    const post = await getNewsById(id, false);
    if (!post) return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    return NextResponse.json({ points: await summarize(post, language as 'en' | 'si' | 'ta') });
  } catch { return NextResponse.json({ error: 'Summary temporarily unavailable. Please try again later.' }, { status: 503, headers: { 'Retry-After': '60' } }); }
}
