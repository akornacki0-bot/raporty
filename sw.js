const CACHE_NAME = 'pr-raporty-v27';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalacja - pobieranie plików do pamięci podręcznej
self.addEventListener('install', e => {
  self.skipWaiting(); // Wymusza przejście do nowej wersji natychmiast
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Buforowanie plików');
      return cache.addAll(ASSETS);
    })
  );
});

// Aktywacja - czyszczenie starych wersji cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('SW: Usuwanie starego cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Obsługa zapytań - tryb Offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // Zwróć plik z cache, a jeśli go nie ma - pobierz z sieci
      return response || fetch(e.request);
    })
  );
});