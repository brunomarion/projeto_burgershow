document.addEventListener('DOMContentLoaded', () => {
  // Estado do carrinho
  let carrinho = [];

  // Elementos
  const modalCombo = document.getElementById('modalCombo01');
  const btnAdicionar = document.getElementById('btnAdicionarCarrinho');
  const btnCarrinho = document.getElementById('btnCarrinho');
  const contadorCarrinho = document.getElementById('contadorCarrinho');
  const carrinhoBody = document.getElementById('carrinhoBody');
  const totalCarrinhoSpan = document.getElementById('totalCarrinho');
  const nomeCombo = modalCombo.querySelector('.modal-title')?.textContent.trim() || 'Combo';


  if (!modalCombo || !btnAdicionar) {
    console.warn('Modal do combo ou botão de adicionar não encontrados. Verifique os IDs.');
    return;
  }

  // Converte "R$ 35,00" -> 35.00
  function parseBRL(text) {
    const m = text && text.match(/[\d\.,]+/);
    if (!m) return 0;
    let num = m[0].trim();
    num = num.replace(/\./g, ''); // remove separador de milhar
    num = num.replace(/,/g, '.'); // troque vírgula por ponto decimal
    return parseFloat(num) || 0;
  }

  // Pega texto legível da opção (apenas a linha principal)
  function getOptionText(input) {
    const label = input.closest('label');
    if (!label) return input.value || '';
    const pl4 = label.querySelector('.pl-4');
    if (!pl4) return label.innerText.trim();
    const lines = pl4.innerText.split('\n').map(s => s.trim()).filter(Boolean);
    return lines[0] || pl4.innerText.trim();
  }

  // Atualiza visual do modal de carrinho
  function atualizarModalCarrinho() {
    if (!carrinhoBody) return;
    if (carrinho.length === 0) {
      carrinhoBody.innerHTML = '<p>Seu carrinho está vazio.</p>';
      if (totalCarrinhoSpan) totalCarrinhoSpan.innerHTML = '<strong>Total:</strong> R$ 0,00';
      if (contadorCarrinho) contadorCarrinho.textContent = '0';
      return;
    }

    let total = 0;
    let html = '';

    carrinho.forEach(item => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;

       html += `
  <div class="d-flex justify-content-between align-items-start mb-2" data-key="${item.key}">
    <!-- Coluna esquerda ocupa mais espaço -->
    <div class="flex-grow-1 me-2" style="width:52%; font-size:14px;">
      <strong>${item.nomeCombo}</strong><br>
      ${item.hamburguer}<br>
      ${item.bebida}<br>
      ${item.porcao}
    </div>

    <!-- Coluna direita mais estreita -->
    <div class="text-end flex-shrink-0" style="width:48%;">
      <div><strong>R$ ${subtotal.toFixed(2)}</strong></div>
      <div class="mt-1">
        <button class="btn btn-sm btn-danger btn-remover ms-2" data-key="${item.key}">Remover</button>
        <button class="btn btn-sm btn-secondary btn-qty" data-key="${item.key}" data-op="minus">-</button>
        <span class="mx-2 qty">${item.quantidade}</span>
        <button class="btn btn-sm btn-secondary btn-qty" data-key="${item.key}" data-op="plus">+</button>
      </div>
    </div>
  </div>
  <hr>
`;


    });

    carrinhoBody.innerHTML = html;
    if (totalCarrinhoSpan) totalCarrinhoSpan.innerHTML = `<strong>Total:</strong> R$ ${total.toFixed(2)}`;

    // Atualiza badge contador
    const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    if (contadorCarrinho) contadorCarrinho.textContent = totalItens;
  }

  // Delegação de eventos no body do carrinho (para +, -, remover)
  if (carrinhoBody) {
    carrinhoBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-qty, .btn-remover');
      if (!btn) return;
      const key = btn.dataset.key;
      if (!key) return;

      const idx = carrinho.findIndex(i => i.key === key);
      if (idx === -1) return;

      if (btn.classList.contains('btn-remover')) {
        carrinho.splice(idx, 1);
      } else if (btn.dataset.op === 'plus') {
        carrinho[idx].quantidade += 1;
      } else if (btn.dataset.op === 'minus') {
        carrinho[idx].quantidade = Math.max(1, carrinho[idx].quantidade - 1);
      }

      atualizarModalCarrinho();
    });
  }

  // Ao clicar em adicionar no modal do combo
  btnAdicionar.addEventListener('click', () => {
    // pega as opções dentro do modal específico
    const hamburguerInput = modalCombo.querySelector('input[name="hamburguer"]:checked');
    const bebidaInput = modalCombo.querySelector('input[name="bebida"]:checked');
    const porcaoInput = modalCombo.querySelector('input[name="porcao"]:checked');

    if (!hamburguerInput || !bebidaInput || !porcaoInput) {
      alert('Selecione todas as opções antes de adicionar ao carrinho!');
      return;
    }

    const hamburguerText = getOptionText(hamburguerInput);
    const bebidaText = getOptionText(bebidaInput);
    const porcaoText = getOptionText(porcaoInput);

    // pega preço do span .total-combo01 dentro do modal
    const totalSpan = modalCombo.querySelector('.total-combo01');
    const preco = totalSpan ? parseBRL(totalSpan.textContent) : 0;

    // cria chave única para esse combo (combinação)
    const key = `${hamburguerText}|${bebidaText}|${porcaoText}`;

    const index = carrinho.findIndex(i => i.key === key);
    if (index > -1) {
      carrinho[index].quantidade += 1;
    } else {
      carrinho.push({
        key,
        nomeCombo, 
        hamburguer: hamburguerText,
        bebida: bebidaText,
        porcao: porcaoText,
        preco: preco,
        quantidade: 1
      });
    }

    atualizarModalCarrinho();

    // fecha o modal do combo (usa getOrCreateInstance pra garantir)
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalCombo);
    modalInstance.hide();
  });

  // DEBUG: se quiser ver no console
  // window._carrinho = carrinho;
});
