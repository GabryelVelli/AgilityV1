document.getElementById('compra-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const compra = {
    nome: document.getElementById('nome').value,
    valor: parseFloat(document.getElementById('valor').value),
    quantidade: parseInt(document.getElementById('quantidade').value),
    prioridade: document.getElementById('prioridade').value,
    categoria: document.getElementById('categoria').value
  };

  try {
    const token = localStorage.getItem('token'); // JWT salvo no login

    const response = await fetch('/compras/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(compra)
    });

    if (response.ok) {
      adicionarNotificacao('Compra cadastrada com sucesso!', 'A_Compras.html');
      mostrarModal('Compra cadastrada com sucesso!');
      this.reset();
    } else {
      const error = await response.text();
      mostrarModal('Erro ao cadastrar compra: ' + error);
    }
  } catch (err) {
    console.error('Erro no envio:', err);
    mostrarModal('Erro inesperado ao cadastrar.');
  }
});


// Função para exibir o modal com a mensagem
function mostrarModal(mensagem) {
    const modal = document.getElementById('modalExclusao');
    const mensagemModal = document.getElementById('mensagemModal');
    const span = document.getElementsByClassName('close')[0];

    mensagemModal.textContent = mensagem;
    modal.style.display = 'block';

 
    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
