const CACHE_NAME = 'planti-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/pages/cadastro.html',
  '/pages/disponibilidade.html',
  '/pages/busca.html',
  '/pages/chat.html',
  '/pages/vaga.html',
  '/css/base.css',
  '/css/components.css',
  '/js/firebase-config.js',
  '/js/auth.js',
  '/js/router.js',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
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
  // Requisições ao Firebase sempre vão para a rede
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('googleapis.com/identitytoolkit') ||
      e.request.url.includes('firestore.googleapis.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
