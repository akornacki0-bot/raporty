const CACHE_NAME = 'pr-raporty-v21'; // Zmieniona wersja wymusza odświeżenie u klienta
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalacja i cache'owanie zasobów
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Wymusza aktywację nowej wersji natychmiast
});

// Usuwanie starych wersji cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Obsługa zapytań (najpierw cache, potem sieć)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});