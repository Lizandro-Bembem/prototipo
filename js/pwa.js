// Registra o service worker e controla o botão "Instalar app"
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function (erro) {
            console.error('Service worker falhou:', erro);
        });
    });
}

(function () {
    var promptInstalar = null;

    var jaInstalado =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    var ehIOS =
        /iphone|ipad|ipod/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    function botao() { return document.getElementById('botao-instalar'); }

    // Chrome/Edge/Android: o navegador avisa que dá para instalar
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        promptInstalar = e;
        if (botao() && !jaInstalado) botao().hidden = false;
    });

    window.addEventListener('appinstalled', function () {
        promptInstalar = null;
        if (botao()) botao().hidden = true;
    });

    document.addEventListener('DOMContentLoaded', function () {
        var b = botao();
        if (!b || jaInstalado) return;

        // iPhone/iPad: não existe prompt automático, mostramos as instruções
        if (ehIOS) b.hidden = false;

        b.addEventListener('click', function () {
            if (promptInstalar) {
                promptInstalar.prompt();
                promptInstalar.userChoice.then(function () {
                    promptInstalar = null;
                    b.hidden = true;
                });
            } else if (ehIOS) {
                alert('Para instalar: toque no botão Compartilhar do Safari e depois em "Adicionar à Tela de Início".');
            }
        });
    });
})();