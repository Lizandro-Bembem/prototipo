// Service worker simples: necessário para o navegador permitir a instalação do app.
// Estratégia: rede primeiro; se estiver sem internet, usa o que ficou guardado.
var CACHE = 'depad-v2';
var ARQUIVOS = [
    './', 'index.html', 'lideres.html', 'css/style.css',
    'js/animacoes.js', 'js/menu.js', 'img/icon-192.png', 'img/icon-512.png',
    'img/icon-512-maskable.png', 'img/favicon.png'
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
    e.waitUntil(caches.keys().then(function (nomes) {
        return Promise.all(nomes.filter(function (n) { return n !== CACHE; })
            .map(function (n) { return caches.delete(n); }));
    }));
    self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    var mesmoSite = new URL(e.request.url).origin === self.location.origin;

    e.respondWith(
        fetch(e.request).then(function (resp) {
            if (mesmoSite && resp && resp.ok) {
                var copia = resp.clone();
                caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
            }
            return resp;
        }).catch(function () { return caches.match(e.request); })
    );
});