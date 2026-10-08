// CanvasKeep service worker. Keep CACHE_NAME in sync with APP_VERSION in index.html.
const CACHE_NAME = 'canvaskeep-v1.3.1';
const FONT_CACHE = 'canvaskeep-fonts';
const SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: precache the shell. Individual adds so one 404 can't fail the whole install.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(SHELL_URLS.map(url =>
        cache.add(url).catch(err => console.warn('SW: skipped', url, err.message))
      ))
    )
  );
});

// Activate: drop old caches, take control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME && k !== FONT_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!url.protocol.startsWith('http')) return;

  // Google Fonts: cache after first load so the app looks right offline
  if (url.hostname.includes('fonts.g')) {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(req).then(hit => hit || fetch(req).then(res => {
          cache.put(req, res.clone());
          return res;
        }))
      ).catch(() => fetch(req))
    );
    return;
  }

  // Only manage our own files; let everything else (Drive, Cast, etc.) go straight to the network
  if (url.origin !== self.location.origin) return;

  // HTML / navigations: network-first so updates arrive, cached copy when offline
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
        }
        return res;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
