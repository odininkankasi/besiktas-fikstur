import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://bjk.8080.tr'),
  title: {
    default: 'Beşiktaş Fikstür & Maç Takvimi | Kara Kartal 1903',
    template: '%s | Beşiktaş Fikstür',
  },
  description:
    'Beşiktaş Jimnastik Kulübü 2026/2027 Trendyol Süper Lig, UEFA Avrupa Ligi ve Ziraat Türkiye Kupası canlı maç takvimi, puan durumu ve Apple/Google takvim senkronizasyonu.',
  applicationName: 'BJK Fikstür',
  authors: [{ name: 'Kara Kartal Taraftar Topluluğu' }],
  generator: 'Next.js',
  keywords: [
    'Beşiktaş',
    'BJK',
    'Fikstür',
    'Beşiktaş Maç Takvimi',
    'Beşiktaş Maçı Ne Zaman',
    'Trendyol Süper Lig',
    'UEFA Avrupa Ligi',
    'Tüpraş Stadyumu',
    'Puan Durumu',
    'bjk.8080.tr',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BJK Fikstür',
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/bjk-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Beşiktaş Fikstür & Maç Takvimi | Kara Kartal 1903',
    description: 'Beşiktaş resmi maç takvimi, canlı puan tablosu ve tek tıkla takvime ekleme.',
    url: 'https://bjk.8080.tr',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Beşiktaş Fikstür (bjk.8080.tr)',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beşiktaş Fikstür & Maç Takvimi',
    description: 'Kara Kartal maç takvimi ve puan tablosu.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-red-600 selection:text-white`}>
        {children}
        <PwaInstallPrompt />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    registration.update();
                  }).catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
