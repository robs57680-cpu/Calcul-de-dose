// Pour publier une mise à jour : modifier index.html, puis changer le numéro de VERSION ci-dessous.
const VERSION = 'v9';
const CACHE = 'calcul-de-doses-' + VERSION;
const FILES = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.all(FILES.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {}))))
  );
});

// Le nouveau service worker attend que l'utilisatrice appuie sur « Mettre à jour ».
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  if (e.data === 'VERSION' && e.source) e.source.postMessage({ version: VERSION });
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
      .catch(() => caches.match('./index.html'))
  );
});
