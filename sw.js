/* 考公工作台 Service Worker
   策略：页面(index.html)采用 network-first，保证每次打开都能拿到 GitHub Pages 上的最新版本；
        静态资源(icon/manifest)采用 cache-first，支持离线打开主屏幕图标。
   这样无论将来 index.html 怎么更新，都不需要每次改 sw.js 也能生效。 */
const CACHE = 'kg-workspace-v2';
const ASSETS = ['./', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isPage = e.request.mode === 'navigate' ||
                 url.pathname.endsWith('/index.html') ||
                 url.pathname.endsWith('/kaogong-workspace/') ||
                 url.pathname === '/kaogong-workspace';
  if (isPage) {
    // 网络优先：始终尝试拿最新页面，仅当断网时才回退缓存
    e.respondWith(
      fetch(e.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  // 静态资源：缓存优先
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return resp;
    }))
  );
});
