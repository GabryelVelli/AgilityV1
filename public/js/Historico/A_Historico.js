   let historicoMovimentacoes = [];

async function carregarHistorico() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/estoque/historico', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    historicoMovimentacoes = await response.json();
    exibirHistorico(historicoMovimentacoes);
  } catch (err) {
    console.error('Erro ao carregar histórico:', err.message);
    mostrarModal('Erro ao buscar histórico');
  }
}

function exibirHistorico(lista) {
  const tabela = document.getElementById('tabela-historico');
  tabela.innerHTML = '';

  lista.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.tipo}</td>
      <td>${item.quantidade}</td>
      <td>${new Date(item.dataMovimentacao).toLocaleString()}</td>
      <td>${item.observacao || ''}</td>
      <td style="text-align: center;">
        <button class="btn-excluir" onclick="excluirMovimentacao(${item.idmovimentacao})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function excluirMovimentacao(idmovimentacao) {
  if (!confirm('Tem certeza que deseja excluir esta movimentação?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/estoque/historico/${idmovimentacao}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      mostrarModal('Movimentação excluída com sucesso!');
      carregarHistorico();
    } else {
      mostrarModal('Erro ao excluir movimentação: ' + await response.text());
    }
  } catch (err) {
    console.error('Erro ao excluir movimentação:', err.message);
    mostrarModal('Erro inesperado ao excluir movimentação.');
  }
}

// Modal igual ao seu padrão
function mostrarModal(mensagem) {
  const modal = document.getElementById('modalExclusao');
  const mensagemModal = document.getElementById('mensagemModal');
  const span = document.getElementsByClassName('close')[0];

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', carregarHistorico);

function filtrarMovimentacoes() {
  const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

  const movimentacoesFiltradas = historicoMovimentacoes.filter(item => {
    const nomeMatch = (item.nome || '').toLowerCase().includes(termoPesquisa);
    const tipoMatch = (item.tipo || '').toLowerCase().includes(termoPesquisa);
    const observacaoMatch = (item.observacao || '').toLowerCase().includes(termoPesquisa);
    const dataMatch = new Date(item.dataMovimentacao).toLocaleString().toLowerCase().includes(termoPesquisa);

    return (
      nomeMatch ||
      tipoMatch ||
      observacaoMatch ||
      dataMatch
    );
  });

  exibirHistorico(movimentacoesFiltradas); // essa função já existe e está correta
}