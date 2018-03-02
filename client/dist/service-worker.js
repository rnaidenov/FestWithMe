if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(() => console.log("Successfully registered service worker!"));
    });
}

var CACHE_NAME = 'fest-with-initial-load-cache-v1';

const toCache = [
    '/',
    'service-worker.js',
    '/bundle.js'
]


self.addEventListener('install', (event) => {
    event.waitUntil(
        _addToCatche(toCache)
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            console.log("TRYING TO GET " + event.request.url);
            if (response) {
                console.log("Getting " + response.url + " from cache");
                return response;
            } else {
                _addNewCaches(event.request.url);
                return fetch(event.request);
            }
        })
    )
});


const _addToCatche = (caches) => {
    caches.open(CACHE_NAME).then(cache => {
        newCaches = Array.isArray(caches) ? caches : Array(newCaches);
        return cache.addAll(newCaches);
    })
}


const _addNewCaches = (newCaches) => {
    if(newCaches.includes('css') || newCaches.includes('fonts') || newCaches.includes('.jpg')) {
        _addToCatche(newCaches);
    }
}


