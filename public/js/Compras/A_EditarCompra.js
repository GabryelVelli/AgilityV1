document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarModal('ID da compra não informado');
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
    mostrarModal('Erro ao carregar dados da compra.');
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
        adicionarNotificacao('Compra editada com sucesso!', '/view/Compras/A_Compras.html');
        mostrarModal('Compra atualizada com sucesso!');
         // Espera 2 segundos antes de redirecionar
            setTimeout(() => {
                window.location.href = '/view/Compras/A_Compras.html';
            }, 1000);
        
      } else {
        const erro = await response.text();
        mostrarModal('Erro ao atualizar: ' + erro);
      }
    } catch (err) {
      console.error('Erro ao atualizar compra:', err.message);
      mostrarModal('Erro inesperado ao atualizar.');
    }
  });
});
  // Função para exibir o modal com a mensagem

