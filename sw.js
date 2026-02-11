const CACHE_NAME = 'pr-raporty-v30';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Tryb Network First - zawsze świeży kod z serwera, jeśli jest sieć
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});