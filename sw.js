self.addEventListener('install', async event => {
    console.log('install event')
});

self.addEventListener('fetch', async event => {
    console.log('fetch event')
});

const cacheName = 'pwa-conf-v1';
const staticAssets = [
    './',
    './index.html',
    './app.js',
    './vendor/bootstrap/css/bootstrap.min.css'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    (1)
    await cache.addAll(staticAssets);
    (2)
});

self.addEventListener('fetch', event => {
    const req = event.request;
    event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    (1)
    const cachedResponse = await cache.match(req);
    (2)
    return cachedResponse || fetch(req);
    (3)
}

self.addEventListener('fetch', event => {
    const req = event.request;

    if (/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        (1)
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        (2)
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}