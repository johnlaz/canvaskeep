
const CACHE_NAME = 'canvaskeep-v2';
const SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './apple-touch-icon.png'
];

// Install: cache the app shell. Use individual .add() calls so a single 404
// can't poison the whole install (addAll is atomic — one failure rejects everything).
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

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== CACHE_NAME + '-fonts').map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for same-origin, network-first for fonts/CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Skip non-GET and browser-extension requests
  if (event.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Google Fonts: cache then network
  if (url.hostname.includes('fonts.')) {
    event.respondWith(
      caches.open(CACHE_NAME + '-fonts').then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(res => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      ).catch(() => fetch(event.request))
    );
    return;
  }

  // CDN resources (html2canvas etc): cache-first
  if (url.hostname.includes('cdnjs') || url.hostname.includes('googleapis')) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(res => {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        })
      ).catch(() => new Response('Offline', {status: 503}))
    );
    return;
  }

  // App shell: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')));
    })
  );
});

// Background sync placeholder
self.addEventListener('sync', event => {
  if (event.tag === 'canvaskeep-sync') {
    // Future: sync artwork metadata to cloud
    console.log('CanvasKeep background sync');
  }
});

// Push notification placeholder
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'CanvasKeep', {
      body: data.body || 'You have a new memory waiting.',
      icon: './icon-192x192.png',
      badge: './icon-192x192.png',
      tag: 'canvaskeep',
      renotify: false,
      data: data
    })
  );
});
