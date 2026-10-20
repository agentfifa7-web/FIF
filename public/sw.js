// Service worker de l'application FIF.
// - Pages : réseau d'abord (scores toujours à jour), copie en cache pour la
//   consultation hors connexion ; à défaut, page « hors connexion ».
// - Fichiers statiques (_next/static, icônes, écussons, photos) : cache d'abord.
// L'administration et les API ne sont jamais mises en cache.
const VERSION = 'fif-v1'
const PAGES = `${VERSION}-pages`
const ASSETS = `${VERSION}-assets`
const OFFLINE_URL = '/hors-ligne'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGES).then((cache) => cache.addAll([OFFLINE_URL, '/icons/icon-192.png'])).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

function isAsset(url) {
  return url.pathname.startsWith('/_next/static/')
    || /^\/(icons|crests|flags|players|hero-photos|federation|boutique)\//.test(url.pathname)
    || /\.(png|jpe?g|webp|svg|gif|woff2?)$/.test(url.pathname)
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(PAGES).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)) || Response.error()),
    )
    return
  }

  if (isAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(ASSETS).then((cache) => cache.put(request, copy))
        }
        return response
      })),
    )
  }
})
