document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('ID da compra não informado');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/compras/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const compra = await response.json();

    document.getElementById('nome').value = compra.nome;
    document.getElementById('valor').value = compra.valor;
    document.getElementById('quantidade').value = compra.quantidade;
    document.getElementById('prioridade').value = compra.prioridade;
    document.getElementById('categoria').value = compra.categoria;
  } catch (err) {
    console.error('Erro ao carregar compra:', err.message);
    alert('Erro ao carregar dados da compra.');
  }

  document.getElementById('editar-compra-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const dadosAtualizados = {
      nome: document.getElementById('nome').value,
      valor: parseFloat(document.getElementById('valor').value),
      quantidade: parseInt(document.getElementById('quantidade').value),
      prioridade: document.getElementById('prioridade').value,
      categoria: document.getElementById('categoria').value
    };

    try {
      const response = await fetch(`/compras/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (response.ok) {
        alert('Compra atualizada com sucesso!');
        window.location.href = 'A_Compras.html'; // volta pra lista
      } else {
        const erro = await response.text();
        alert('Erro ao atualizar: ' + erro);
      }
    } catch (err) {
      console.error('Erro ao atualizar compra:', err.message);
      alert('Erro inesperado ao atualizar.');
    }
  });
});
