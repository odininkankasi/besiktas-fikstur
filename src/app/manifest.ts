import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beşiktaş Fikstür & Canlı Maç Takvimi',
    short_name: 'BJK Fikstür',
    description: 'Beşiktaş JK 2026/2027 sezonu resmi maç takvimi, puan durumu ve takvim senkronizasyonu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/bjk-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/bjk-logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ]
  };
}
