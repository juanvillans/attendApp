const cacheName = 'attendApp-cache';
const precacheResources = [
  '/',
  '/asistencia.html',
  '/formularios.html',
  '/stylesheets/asistencia.css',
  '/stylesheets/style_formularios.css',
  '/javascripts/asistencia.js',
  '/javascripts/formularios-dinamicos.js',
];

self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(precacheResources))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== cacheName)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      const clonedResponse = networkResponse.clone();
      caches.open(cacheName).then((cache) => {
        cache.put(event.request, clonedResponse);
      });
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});