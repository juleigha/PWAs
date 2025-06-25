const CACHEV = "v13";
const DYNCACHE = "image-grid-cache";
const APPCACHE = [
    './',
    './index.html',
    './main.js',
    './master.css',
    './manifest.json',
    './pwa_assets/icon-48.png',
    './pwa_assets/icon-72.png',
    './pwa_assets/icon-96.png',
    './pwa_assets/icon-192.png',
    './pwa_assets/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHEV)
      .then(cache => cache.addAll(APPCACHE))
      .then(self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  const currentCaches = [CACHEV, DYNCACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        console.log(cacheToDelete);
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  var newresp = {
    "bodyUsed": true,
    "status": "200",
    "statusText": "Ok",
    "url":"GETLIST"
  }
if (event.request.url.startsWith(self.location.origin) && event.request.method !== "POST") {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        console.log(event.request);
        if ( cachedResponse !== undefined) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          console.log(cachedResponse,response,cachedResponse === response);
          return response;
        });

      })
    );
  }
});
