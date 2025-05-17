document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token');

  if (!id) {
    alert('ID da nota fiscal não informado');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/nota/${id}`, {  // Corrigido aqui
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
      window.location.href = 'A_NotaFiscal.html';
    });

    document.getElementById('btn-editar').addEventListener('click', () => {
      window.location.href = `A_EditarNotaFiscal.html?id=${id}`;
    });
  } catch (err) {
    mostrarModal('Erro ao carregar nota fiscal: ' + err.message);
  }
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
