async function carregarCompras() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/compras/listar', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const compras = await response.json();
    const tabela = document.getElementById('tabela-compras');
    tabela.innerHTML = '';

    compras.forEach(compra => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${compra.nome}</td>
        <td>R$ ${isNaN(Number(compra.valor)) ? '0.00' : Number(compra.valor).toFixed(2)}</td>
        <td>${compra.quantidade}</td>
        <td>${compra.prioridade}</td>
        <td>${compra.categoria}</td>
        <td>
          <button class="btn-detalhes" onclick="verDetalhes(${compra.IDCompras})">Detalhes</button>
          <button class="btn-editar" onclick="editarCompra(${compra.IDCompras})">Editar</button>
          <button class="btn-excluir" onclick="excluirCompra(${compra.IDCompras})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro ao carregar compras:', err.message);
    mostrarModal('Erro ao buscar compras');
  }
}

async function excluirCompra(id) {
  if (!confirm('Deseja excluir esta compra?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/compras/excluir/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      adicionarNotificacao('Compra Excluida com sucesso!', 'A_Compras.html');
      mostrarModal('Compra excluída com sucesso');
      carregarCompras();
    } else {
     mostrarModal('Erro ao excluir: ' + (await response.text()));
    }
  } catch (err) {
    console.error('Erro ao excluir:', err.message);
  }
}

function editarCompra(id) {
  window.location.href = `A_EditarCompra.html?id=${id}`;
}
function verDetalhes(id) {
  // Redireciona para a página de detalhes passando o ID pela URL
  window.location.href = `A_DetalhesCompra.html?id=${id}`;
}
// Carregar a tabela automaticamente
document.addEventListener('DOMContentLoaded', carregarCompras);
function mostrarModal(mensagem) {
  const modal = document.getElementById('modalExclusao');
  const mensagemModal = document.getElementById('mensagemModal');
  const span = document.getElementsByClassName('close')[0];

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  // Fecha o modal quando o usuário clica no "x"
  span.onclick = function() {
      modal.style.display = 'none';
  }

  // Fecha o modal quando o usuário clica fora do conteúdo do modal
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
}