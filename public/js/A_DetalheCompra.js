document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token'); // Se estiver usando autenticação

  if (!id) {
    alert('ID da compra não informado');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/compras/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(await response.text());

    const compra = await response.json();

    document.getElementById('nome').textContent = compra.nome;
    document.getElementById('valor').textContent = `R$ ${compra.valor.toFixed(2)}`;
    document.getElementById('quantidade').textContent = compra.quantidade;
    document.getElementById('prioridade').textContent = compra.prioridade;
    document.getElementById('categoria').textContent = compra.categoria;

  } catch (err) {
    mostrarModal('Erro ao carregar compra: ' + err.message);
  }

  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = 'A_Compras.html';
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    window.location.href = `A_EditarCompra.html?id=${id}`;
  });
});
 // Função para exibir o modal com a mensagem
    function mostrarModal(mensagem) {
        const modal = document.getElementById('modalExclusao');
        const mensagemModal = document.getElementById('mensagemModal');
        const span = document.getElementsByClassName('close')[0];

        mensagemModal.textContent = mensagem;
        modal.style.display = 'block';

        // Fecha o modal quando o usuário clica no "x"
        span.onclick = function () {
            modal.style.display = 'none';
        }

        // Fecha o modal quando o usuário clica fora do conteúdo do modal
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
