const CACHE = 'robotlab-studio-v4';
const FILES = ['./index.html', './app.html', './app.js', './gallery.js', './discover.js', './feedback.js', './polish.css', './images/brush.jpg', './images/desk.jpg', './images/rover.jpg', './images/line.jpg', './images/artist.jpg', './install.js', './desk-buddy.ino', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
const urls = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
async function safeResponse(response, html = false) {
  if (!response.ok || response.redirected) return false;
  if (!html && (response.headers.get('Content-Type') || '').includes('text/html')) return false;
  if (html && !(await response.clone().text()).includes('name="robotlab-app" content="robotlab-studio"')) return false;
  return true;
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const path of FILES) {
      const url = new URL(path, self.registration.scope).href;
      const response = await fetch(url, {cache:'reload'});
      if (!await safeResponse(response, path === './index.html' || path === './app.html')) throw new Error('Offline assets unavailable');
      await cache.put(url, response);
    }
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('robotlab-studio-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  const indexUrl = new URL('./index.html', self.registration.scope).href;
  const navigation = event.request.mode === 'navigate' && (requestUrl.pathname === new URL(self.registration.scope).pathname || requestUrl.pathname === new URL(indexUrl).pathname || requestUrl.pathname === new URL('./app.html', self.registration.scope).pathname);
  if (!navigation && !urls.has(requestUrl.href)) return;
  const navigationKey = requestUrl.pathname.endsWith('/app.html') ? new URL('./app.html', self.registration.scope).href : indexUrl;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      // Avoid storing sign-in pages or redirects in the offline shell.
      if (await safeResponse(response, navigation || requestUrl.href === indexUrl || requestUrl.pathname.endsWith('/app.html'))) await cache.put(navigation ? navigationKey : event.request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(navigation ? navigationKey : event.request);
      if (cached) return cached;
      return new Response('RobotLab is unavailable offline. Reconnect and try again.', {status:503,headers:{'Content-Type':'text/plain'}});
    }
  })());
});
