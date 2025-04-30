document.addEventListener('DOMContentLoaded', () => {
  carregarCompras();  // Carrega as compras assim que a página carrega
});

// Função para carregar as compras
async function carregarCompras() {
  const token = localStorage.getItem('token');
  const tabela = document.querySelector('#tabela-compras tbody');
  tabela.innerHTML = '';  // Limpa a tabela antes de atualizar

  try {
    const response = await fetch('/compras', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const compras = await response.json();

    compras.forEach(compra => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${compra.nome}</td>
        <td>R$ ${parseFloat(compra.valor).toFixed(2)}</td>
        <td>${compra.quantidade}</td>
        <td>${compra.categoria}</td>
        <td>${compra.prioridade}</td>
        <td>
          <button onclick="editarCompra(${compra.id})">Editar</button>
          <button onclick="excluirCompra(${compra.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro ao carregar compras:', err);
  }
}

// Função para excluir compra
async function excluirCompra(id) {
  const token = localStorage.getItem('token');
  await fetch(`/excluir-compra/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  carregarCompras();  // Atualiza a lista após excluir
}

// Função para editar compra
async function editarCompra(id) {
  const nome = prompt('Novo nome:');
  const valor = prompt('Novo valor:');
  const quantidade = prompt('Nova quantidade:');
  const categoria = prompt('Nova categoria:');
  const prioridade = prompt('Nova prioridade:');

  if (!nome || !valor || !quantidade || !categoria || !prioridade) return;

  await fetch(`/editar-compra/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      nome,
      valor: parseFloat(valor),
      quantidade: parseInt(quantidade),
      categoria,
      prioridade
    })
  });

  carregarCompras();  // Atualiza a lista após editar
}
