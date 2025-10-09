 const btnAdicionar = document.getElementById('btnAdicionarCarrinho');
    const modalCombo01 = document.getElementById('modalCombo01');
    const alertCarrinho = document.getElementById('alertCarrinho');

    const bootstrapModal = new bootstrap.Modal(modalCombo01);

    btnAdicionar.addEventListener('click', () => {
        // Fechar modal
        bootstrapModal.hide();

        // Remove classe show e força o display block
        alertCarrinho.classList.remove('show');
        alertCarrinho.style.display = 'block';

        // Adiciona show para animar o fade
        setTimeout(() => {
            alertCarrinho.classList.add('show');
        }, 10); // pequeno delay necessário para a animação funcionar

        // Esconde o alert após 3 segundos
        setTimeout(() => {
            alertCarrinho.classList.remove('show');
            // mantém o display:block para poder mostrar novamente depois
        }, 3000);
    });