
const form = document.getElementById('compras-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: form.nome.value,
    valor: form.valor.value,
    quantidade: form.quantidade.value,
    prioridade: form.prioridade.value,
    categoria: form.categoria.value
  };

  try {
    const response = await fetch('/add-compra', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajuste conforme onde guarda o token
      },
      body: JSON.stringify(data)
    });

    const result = await response.text();

    if (response.ok) {
        mostrarModal(result);
      form.reset();
    } else {
        mostrarModal('Erro: ' + result);
    }
  } catch (err) {
    mostrarModal('Erro na requisição:', err);
    mostrarModal('Erro ao enviar dados.');
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
