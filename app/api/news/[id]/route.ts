import { NextResponse } from 'next/server';
import { getPost } from '@/lib/api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const post = await getPost(id);
    if (!post) {
      return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach the Esana API right now.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
