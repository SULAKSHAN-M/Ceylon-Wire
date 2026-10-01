import type { Metadata, Viewport } from 'next';
import { Yaldevi, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_URL } from '@/lib/site';
import { OfflineSupport } from '@/components/OfflineSupport';

const yaldevi = Yaldevi({
  subsets: ['latin', 'sinhala'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['latin', 'sinhala'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['latin', 'tamil'],
  weight: ['400', '500', '600'],
  variable: '--font-tamil',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ceylon Wire — Sri Lankan news, as it breaks',
    template: '%s — Ceylon Wire',
  },
  description:
    'A Sri Lankan news reader with Sinhala, English and Tamil support, covering the latest breaking stories from the Esana feed.',
  openGraph: {
    type: 'website',
    siteName: 'Ceylon Wire',
    title: 'Ceylon Wire — Sri Lankan news, as it breaks',
    description:
      'A Sri Lankan news reader with Sinhala, English and Tamil support, covering the latest breaking stories from the Esana feed.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Ceylon Wire',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EEE1' },
    { media: '(prefers-color-scheme: dark)', color: '#221E19' },
  ],
};

// Applied before hydration (blocking inline script) so a stored dark-theme
// preference takes effect before first paint, instead of flashing light
// first. Reads localStorage directly rather than importing the provider's
// key, since it must run standalone with no React/module context yet.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('colombo-wire-theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${yaldevi.variable} ${notoSansSinhala.variable} ${notoSansTamil.variable}`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <a href="#main-content" className="skip-link rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper">
              Skip to content
            </a>
            <OfflineSupport />
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
