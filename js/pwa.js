if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function (erro) {
            console.error('Service worker falhou:', erro);
        });
    });
}