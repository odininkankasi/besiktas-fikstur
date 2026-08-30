import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    template: '%s | Beşiktaş Fikstür'
  },
  description: 'Beşiktaş Jimnastik Kulübü 2026/2027 Trendyol Süper Lig, UEFA Avrupa Ligi ve Ziraat Türkiye Kupası canlı maç takvimi, puan durumu ve Apple/Google takvim senkronizasyonu.',
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
    'bjk.8080.tr'
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/bjk-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/bjk-logo.svg', type: 'image/svg+xml' }
    ]
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
  }
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
      </body>
    </html>
  );
}
