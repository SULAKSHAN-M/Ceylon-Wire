import { ImageResponse } from 'next/og';

export const alt = 'Ceylon Wire — Sri Lankan news, as it breaks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#F3EEE1',
          padding: '80px',
        }}
      >
        <div style={{ fontSize: 28, color: '#79705F' }}>Ceylon Wire</div>
        <div style={{ fontSize: 60, fontWeight: 700, color: '#221E19', marginTop: 20 }}>
          Sri Lankan news, as it breaks.
        </div>
        <div style={{ marginTop: 40, width: 80, height: 6, backgroundColor: '#C1791C' }} />
      </div>
    ),
    { ...size },
  );
}
