let historicoMovimentacoes = [];

async function carregarHistorico() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/estoque/historico', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    historicoMovimentacoes = await response.json();
    exibirHistorico(historicoMovimentacoes);
  } catch (err) {
    console.error('Erro ao carregar historico:', err.message);
    mostrarModal('Erro ao buscar historico');
  }
}

function exibirHistorico(lista) {
  const tabela = document.getElementById('tabela-historico');
  tabela.innerHTML = '';

  lista.forEach((item) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.tipo}</td>
      <td>${item.quantidade}</td>
      <td>${new Date(item.dataMovimentacao).toLocaleString()}</td>
      <td>${item.observacao || ''}</td>
      <td style="text-align: center;">
        ${createActionMenu([
          { label: 'Excluir', action: `excluirMovimentacao(${item.idmovimentacao})`, danger: true }
        ])}
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function excluirMovimentacao(idmovimentacao) {
  if (!confirm('Tem certeza que deseja excluir esta movimentacao?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/estoque/historico/${idmovimentacao}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      mostrarModal('Movimentacao excluida com sucesso!');
      carregarHistorico();
    } else {
      mostrarModal('Erro ao excluir movimentacao: ' + await response.text());
    }
  } catch (err) {
    console.error('Erro ao excluir movimentacao:', err.message);
    mostrarModal('Erro inesperado ao excluir movimentacao.');
  }
}

function filtrarMovimentacoes() {
  const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

  const movimentacoesFiltradas = historicoMovimentacoes.filter((item) => {
    const nomeMatch = (item.nome || '').toLowerCase().includes(termoPesquisa);
    const tipoMatch = (item.tipo || '').toLowerCase().includes(termoPesquisa);
    const observacaoMatch = (item.observacao || '').toLowerCase().includes(termoPesquisa);
    const dataMatch = new Date(item.dataMovimentacao).toLocaleString().toLowerCase().includes(termoPesquisa);

    return nomeMatch || tipoMatch || observacaoMatch || dataMatch;
  });

  exibirHistorico(movimentacoesFiltradas);
}

document.addEventListener('DOMContentLoaded', carregarHistorico);
