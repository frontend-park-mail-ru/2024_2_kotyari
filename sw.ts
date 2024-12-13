const CACHE_NAME = 'cache-v2';
const DYNAMIC_CACHE_NAME = 'dynamic';

// List of URLs to precache
const PRECACHE_URLS: string[] = [
  '/',
  '/catalog',
  '/files',
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
            return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
        });
    }));
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
