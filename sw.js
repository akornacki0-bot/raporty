const CACHE_NAME = 'pr-raporty-v28'; // Zmieniamy numer, aby wymusić reset
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  console.log('SW: Instalacja wersji v28');
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  console.log('SW: Aktywacja i czyszczenie starego cache');
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

// Ten fragment wymusza pobieranie ZAWSZE z sieci, gdy jest internet
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});