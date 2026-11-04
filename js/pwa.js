// Registra o service worker (necessário para o PWA ser instalável)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // caminho relativo: funciona na raiz e em subpasta (GitHub Pages)
        navigator.serviceWorker.register('sw.js').catch(function (erro) {
            console.error('Service worker falhou:', erro);
        });
    });
}