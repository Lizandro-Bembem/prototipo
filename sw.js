// Service worker: rede primeiro; sem internet, usa o que ficou guardado.
var CACHE = 'depad-v4';
var ARQUIVOS = [
    './',
    'index.html',
    'lideres.html',
    'sede.html',
    'manifest.json',
    'css/style.css',
    'js/animacoes.js',
    'js/menu.js',
    'js/pwa.js',
    'img/icon-192.png',
    'img/icon-512.png',
    'img/icon-512-maskable.png',
    'img/favicon.png',
    'img/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE).then(function (c) {
            return Promise.all(ARQUIVOS.map(function (url) {
                return c.add(url).catch(function () {
                    console.warn('Não foi possível guardar:', url);
                });
            }));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (nomes) {
            return Promise.all(
                nomes.filter(function (n) { return n !== CACHE; })
                    .map(function (n) { return caches.delete(n); })
            );
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;

    var url = new URL(e.request.url);
    // só trata o próprio site; fontes, mapas etc. passam direto
    if (url.origin !== self.location.origin) return;

    e.respondWith(
        fetch(e.request).then(function (resp) {
            if (resp && resp.ok) {
                var copia = resp.clone();
                caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
            }
            return resp;
        }).catch(function () {
            return caches.match(e.request, { ignoreSearch: true }).then(function (guardado) {
                if (guardado) return guardado;
                if (e.request.mode === 'navigate') return caches.match('index.html');
                return Response.error();
            });
        })
    );
});