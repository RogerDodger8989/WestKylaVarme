self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('wkv-cache-v1').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/manifest.webmanifest',
      '/icon-192.png',
      '/icon-512.png'
    ]))
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open('wkv-cache-v1').then((cache) => cache.put(event.request, copy));
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
