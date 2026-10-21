// Faz os elementos aparecerem suavemente quando a pessoa rola a página
(function () {
    // Se o navegador for muito antigo, mostra tudo sem animação
    if (!('IntersectionObserver' in window)) {
        document.documentElement.classList.remove('js');
        return;
    }

    var alvos = document.querySelectorAll(
        'main h2, .intro, .sobre-destaque, .sobre-texto, .horarios li, .evento, ' +
        '.galeria-grade .foto, .cartao-testemunho, .form-testemunho, ' +
        '.contato-links, .endereco, .lider, .botao-voltar'
    );

    var contagem = new Map();

    var observador = new IntersectionObserver(function (itens) {
        itens.forEach(function (item) {
            if (item.isIntersecting) {
                item.target.classList.add('visivel');
                observador.unobserve(item.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) {
        // pequeno atraso entre irmãos, para entrarem um depois do outro
        var n = contagem.get(el.parentNode) || 0;
        contagem.set(el.parentNode, n + 1);
        el.style.setProperty('--atraso', Math.min(n, 4) * 0.1 + 's');

        el.classList.add('revelar');
        observador.observe(el);
    });
})();