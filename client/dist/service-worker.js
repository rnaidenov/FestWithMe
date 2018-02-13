if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(() => console.log("Successfully registered service worker!"));
    });
}

var CACHE_NAME = 'fest-with-initial-load-cache';

const toCache = [
    '/',
    '/bundle.js'
]



self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(toCache);
        })
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) console.log("Getting back response from cache ", response);
            return response || fetch(event.request);
        })
    )
});
