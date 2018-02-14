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

const _addToCatche = (newCaches) => {
    const toCache = Array.isArray(newCaches) ? newCaches : Array(newCaches);
    caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(toCache);
    })
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        _addToCatche(toCache)
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log("Getting " + response.url + " from cache");
                return response;
            } else {
                _addToCatche(event.request.url);
                return fetch(event.request);
            }
        })
    )
});
