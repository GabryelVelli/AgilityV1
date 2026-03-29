document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token'); // pegar token do localStorage

  if (!id) {
    mostrarModal('ID da compra não informado');
    return;
  }

  try {
      const response = await fetch(`/compras/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(await response.text());

    const compra = await response.json();

    document.getElementById('nome').textContent = compra.nome;

    // Converter para número e formatar com 2 casas decimais, com fallback para '0.00'
    const valorFormatado = compra.valor ? parseFloat(compra.valor).toFixed(2) : '0.00';
    document.getElementById('valor').textContent = `R$ ${valorFormatado}`;

    document.getElementById('quantidade').textContent = compra.quantidade;
    document.getElementById('prioridade').textContent = compra.prioridade;
    document.getElementById('categoria').textContent = compra.categoria;

  } catch (err) {
    mostrarModal('Erro ao carregar compra: ' + err.message);
  }

  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = '/view/Compras/A_Compras.html';
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    window.location.href = `/view/Compras/A_EditarCompra.html?id=${id}`;
  });
});

// Função para exibir o modal com a mensagem

