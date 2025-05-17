document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token'); // se usar token, se não remove essa linha e header

  if (!id) {
    alert('ID do produto não informado');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/produtos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const produto = await response.json();

    document.getElementById('nome').textContent = produto.nome;
    document.getElementById('codigoBarras').textContent = produto.codigoBarras;
    document.getElementById('quantidade').textContent = produto.quantidade;
    document.getElementById('categoria').textContent = produto.categoria;
    document.getElementById('fornecedor').textContent = produto.fornecedor;
    document.getElementById('vencimento').textContent = new Date(produto.vencimento).toLocaleDateString();
  } catch (err) {
    alert('Erro ao carregar produto: ' + err.message);
  }

  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = 'A_Estoque.html'; // ajusta para sua página de estoque
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    window.location.href = `A_EditarProduto.html?id=${id}`; // ajusta para sua página de editar
  });
});

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