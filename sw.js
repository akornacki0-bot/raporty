const CACHE_NAME = 'pr-raporty-v31';
const PLIKI = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalacja - wymuszamy nową wersję
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PLIKI))
  );
});

// Aktywacja - czyścimy absolutnie wszystko, co stare
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

// Strategia: Najpierw Sieć (Network First)
// Dzięki temu, gdy masz internet, zawsze pobierze v31, a nie v30 z pamięci.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});