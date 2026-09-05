import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beşiktaş Fikstür & Canlı Maç Takvimi | Kara Kartal 1903',
    short_name: 'BJK Fikstür',
    description: 'Beşiktaş JK 2026/2027 sezonu resmi maç takvimi, canlı puan durumu ve takvim senkronizasyonu.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Maç Fikstürü',
        short_name: 'Fikstür',
        description: 'Beşiktaş Süper Lig ve Avrupa maç takvimi',
        url: '/',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}

