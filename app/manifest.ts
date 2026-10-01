import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ceylon Wire — Sri Lankan news, as it breaks',
    short_name: 'Ceylon Wire',
    description:
      'A Sri Lankan news reader with Sinhala, English and Tamil support, covering the latest breaking stories from the Esana feed.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F3EEE1',
    theme_color: '#221E19',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
