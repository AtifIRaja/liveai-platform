const CACHE_NAME = 'a2z-dispatch-v1';
const ASSETS = [
  '/liveai-platform/a2z-dispatch/',
  '/liveai-platform/a2z-dispatch/index.html',
  '/liveai-platform/a2z-dispatch/portal-pk.html',
  '/liveai-platform/a2z-dispatch/portal-us.html',
  '/liveai-platform/a2z-dispatch/manifest.json',
  'https://atifiraja.github.io/liveai-platform/liveai-logo.png'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first with network fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('/liveai-platform/a2z-dispatch/index.html'));
    })
  );
});
