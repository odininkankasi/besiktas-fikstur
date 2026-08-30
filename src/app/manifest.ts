import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beşiktaş Fikstür & Maç Takvimi',
    short_name: 'BJK Fikstür',
    description: 'Beşiktaş Jimnastik Kulübü resmi maç takvimi, canlı puan durumu ve takvim senkronizasyonu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#e30a17',
    icons: [
      {
        src: '/bjk-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/bjk-logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable'
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
