import { NextResponse } from 'next/server';
import { getNewsById } from '@/lib/api';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d{1,12}$/.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const post = await getNewsById(id, false);
    return NextResponse.json(post ? { post } : { error: 'Not found' }, { status: post ? 200 : 404 });
  } catch { return NextResponse.json({ error: 'Story unavailable' }, { status: 503 }); }
}
