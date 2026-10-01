import { NextResponse } from 'next/server';
import { getLatestNews } from '@/lib/api';

export async function GET() {
  try {
    const posts = await getLatestNews();
    return NextResponse.json({ posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach the Esana API right now.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
