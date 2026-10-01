import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/api';

export const alt = 'Ceylon Wire story';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id).catch(() => null);
  const title = post?.title_en || post?.title || 'Ceylon Wire';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F3EEE1',
          padding: '80px',
        }}
      >
        <div style={{ fontSize: 28, color: '#79705F' }}>Ceylon Wire</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: '#221E19', lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ width: 80, height: 6, backgroundColor: '#C1791C' }} />
      </div>
    ),
    { ...size },
  );
}
