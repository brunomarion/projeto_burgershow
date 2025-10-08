  function criarContador(botao) {
    let count = 1;

    // Criando Contador <button class="btn btn-primary add-btn">+</button>
    const counterDiv = document.createElement('div');
    counterDiv.classList.add('d-flex', 'align-items-center', 'gap-2');

    counterDiv.innerHTML = `
      <button class="btn btn-danger minus-btn">-</button>
      <span class="mx-2 fs-5 count">${count}</span>
      <button class="btn btn-success plus-btn">+</button>
    `;

    // Substitui apenas o botão, não o preço
    botao.replaceWith(counterDiv);

    const countSpan = counterDiv.querySelector('.count');
    const minusBtn = counterDiv.querySelector('.minus-btn');
    const plusBtn = counterDiv.querySelector('.plus-btn');

    plusBtn.addEventListener('click', () => {
      count++;
      countSpan.textContent = count;
    });

    minusBtn.addEventListener('click', () => {
      count--;
      if (count <= 0) {
        // Volta o botão + no lugar do contador
        counterDiv.replaceWith(botao);
      } else {
        countSpan.textContent = count;
      }
    });
  }


  // Inicializa os botões +
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => criarContador(btn));
  });