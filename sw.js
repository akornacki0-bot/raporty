const CACHE_NAME = 'inspect-app-v22'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Wymusza natychmiastową aktywację nowej wersji
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key); // Usuwa wszystkie STARE wersje
      })
    ))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});