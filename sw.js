const CACHE_NAME = 'enlace-izcalli-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://appdesignmex.com/enlaceizcallichica.jpg',
  'https://appdesignmex.com/enlaceizcallidigitall.png',
  'https://appdesignmex.com/enlaceizcalli.png',
  'https://appdesignmex.com/enlaceizcalliicono.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listener for push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Enlace Izcalli', body: '¡Hay nuevas actualizaciones para ti!' };
  const title = data.title;
  const options = {
    body: data.body,
    icon: 'https://appdesignmex.com/enlaceizcalliicono.png',
    badge: 'https://appdesignmex.com/enlaceizcalliicono.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Listener for notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});