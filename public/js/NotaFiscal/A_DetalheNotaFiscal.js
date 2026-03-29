document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token');

  if (!id) {
    mostrarModal('ID da nota fiscal não informado');
    return;
  }

  try {
    const response = await fetch(`/nota/${id}`, {  // Corrigido aqui
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const nota = await response.json();

    document.getElementById('numero').textContent = nota.Numero;
    document.getElementById('serie').textContent = nota.Serie;
    document.getElementById('data_emissao').textContent = new Date(nota.data_emissao).toLocaleDateString();
    document.getElementById('valor_total').textContent = `R$ ${parseFloat(nota.Valor_total).toFixed(2)}`;
    document.getElementById('fornecedor').textContent = nota.Fornecedor;

    document.getElementById('btn-voltar').addEventListener('click', () => {
      window.location.href = '/view/NotaFiscal/A_NotaFiscal.html';
    });

    document.getElementById('btn-editar').addEventListener('click', () => {
      window.location.href = `/view/NotaFiscal/A_EditarNotaFiscal.html?id=${id}`;
    });
  } catch (err) {
    mostrarModal('Erro ao carregar nota fiscal: ' + err.message);
  }
});
 // Função para exibir o modal com a mensagem

