// Service worker simples: necessário para o navegador permitir a instalação do app.
// Estratégia: rede primeiro; se estiver sem internet, usa o que ficou guardado.
var CACHE = 'depad-v2';
var ARQUIVOS = [
    './', 'index.html', 'lideres.html', 'css/style.css',
    'js/animacoes.js', 'js/menu.js', 'img/icon-192.png', 'img/icon-512.png',
    'img/icon-512-maskable.png', 'img/favicon.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARQUIVOS); }));
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
    e.respondWith(
        fetch(e.request).then(function (resp) {
            var copia = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
            return resp;
        }).catch(function () { return caches.match(e.request); })
    );
});
