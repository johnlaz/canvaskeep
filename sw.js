
const CACHE_NAME = 'canvaskeep-v1';
const SHELL_URLS = ['./', './canvaskeep.html'];

// Install: cache the app shell
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS)).catch(()=>{})
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
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
      }).catch(() => caches.match('./'));
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
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'canvaskeep',
      renotify: false,
      data: data
    })
  );
});
