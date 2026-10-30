/* ===== SERVICE WORKER — Offline cache ===== */
// ⚠️ Khi deploy code mới, đổi CACHE_VERSION để buộc browser cập nhật
const CACHE_VERSION = 'v1.8';
const CACHE_NAME = 'bangcong-' + CACHE_VERSION;

const PRECACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './auth.js',
  './firebase.js',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(PRECACHE.map(url =>
        cache.add(url).catch(err => console.warn('[SW] skip cache:', url, err))
      ))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Không cache endpoint auth + realtime database
  if (url.hostname === 'identitytoolkit.googleapis.com') return;
  if (url.hostname.includes('firebaseio.com')) return;
  if (url.hostname.includes('firebasedatabase.app')) return;
  if (url.protocol === 'wss:') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Stale-while-revalidate: trả cache ngay, cập nhật ngầm
        fetch(e.request)
          .then(res => {
            if (res && res.status === 200) {
              caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
