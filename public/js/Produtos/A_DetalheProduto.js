document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token'); // se estiver usando token JWT

  if (!id) {
    mostrarModal('ID do produto não informado');
    return;
  }

  try {
    const response = await fetch(`../produtos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const produto = await response.json();

    document.getElementById('nome').textContent = produto.nome || '';
    document.getElementById('codigoBarras').textContent = produto.codigoBarras || '';
    document.getElementById('vencimento').textContent = new Date(produto.vencimento).toLocaleDateString() || '';
    document.getElementById('quantidade').textContent = produto.quantidade || '';
    document.getElementById('fornecedor').textContent = produto.fornecedor || '';
    document.getElementById('categoria').textContent = produto.categoria || '';

  } catch (err) {
    mostrarModal('Erro ao carregar Produto: ' + err.message);
  }

  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = '/view/Produtos/A_Estoque.html';
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    window.location.href = `/view/Produtos/A_EditarProduto.html?id=${id}`;
  });
});

