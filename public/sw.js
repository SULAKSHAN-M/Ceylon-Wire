const CACHE = 'colombo-wire-offline-v4';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/offline.html', '/offline.js'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('colombo-wire-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname === '/offline.html' || url.pathname === '/offline.js') {
    event.respondWith(caches.match(url.pathname).then(cached => cached || fetch(event.request)));
  } else if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
  }
});
self.addEventListener('push', event => {
  let payload={};try{payload=event.data.json();}catch{}
  const path=typeof payload.url==='string'&&/^\/news\/\d+$/.test(payload.url)?payload.url:'/';
  event.waitUntil(self.registration.showNotification(typeof payload.title==='string'?payload.title:'Ceylon Wire',{
    body:typeof payload.body==='string'?payload.body:'A new story is available.',icon:'/icon-192.png',badge:'/icon-192.png',tag:payload.tag||'ceylon-wire',data:{url:path}
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const path=event.notification.data?.url;
  const target=new URL(typeof path==='string'&&/^\/news\/\d+$/.test(path)?path:'/',self.location.origin).href;
  event.waitUntil(self.clients.openWindow(target));
});
