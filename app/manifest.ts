import type { MetadataRoute } from 'next'

// Manifeste de l'application installable (PWA) « FIF ».
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'FIF — Fédération Ivoirienne de Football',
    short_name: 'FIF',
    description: 'Actualités, compétitions, résultats, Éléphants, clubs et joueurs du football ivoirien.',
    lang: 'fr',
    start_url: '/?source=app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#041b12',
    categories: ['sports', 'news'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Résultats', url: '/resultats', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Calendrier', url: '/matches', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Ligue 1', url: '/competitions/ligue-1', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Éléphants', url: '/equipes-nationales/elephants', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  }
}
