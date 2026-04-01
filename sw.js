const CACHE_NAME = 'planti-v1';
const ASSETS = [
  '/planti/',
  '/planti/index.html',
  '/planti/css/base.css',
  '/planti/css/components.css',
  '/planti/js/firebase-config.js',
  '/planti/js/auth.js',
  '/planti/js/router.js',
  '/planti/js/utils.js',
  '/planti/js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('googleapis.com') ||
      e.request.url.includes('gstatic.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
