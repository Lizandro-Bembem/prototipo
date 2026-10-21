// Abre e fecha o menu no celular
(function () {
    var botao = document.querySelector('.menu-botao');
    var menu = document.getElementById('menu-principal');
    if (!botao || !menu) return;

    function fechar() {
        menu.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
    }

    botao.addEventListener('click', function () {
        var aberto = menu.classList.toggle('aberto');
        botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    // fecha ao escolher um item
    menu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') fechar();
    });

    // fecha com a tecla Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') fechar();
    });
})();