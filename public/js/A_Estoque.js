let produtos = []; // Escopo global para ser acessado em qualquer função

async function carregarProdutos() {
  try {
    const response = await fetch('/produtos', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      produtos = await response.json(); // Preenche a variável global
      exibirProdutos(produtos);
    } else {
      mostrarModal('Erro ao carregar produtos');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarModal('Erro ao carregar produtos');
  }
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR');
}

function exibirProdutos(produtos) {
  const tbody = document.getElementById('tabela-produtos');
  tbody.innerHTML = ''; // Limpa a tabela

  produtos.forEach(produto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.codigoBarras}</td>
      <td>${formatarData(produto.vencimento)}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.fornecedor}</td>
      <td>${produto.categoria}</td>
      <td style="text-align: center;">
        <button class="btn-detalhes" onclick="verDetalhes(${produto.idproduto})">Detalhes</button>
        <button class="btn-editar" onclick="editarProduto(${produto.idproduto})">Editar</button>
        <button class="btn-excluir" onclick="excluirProduto(${produto.idproduto})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editarProduto(id) {
  window.location.href = `A_EditarProduto.html?id=${id}`;
}

async function excluirProduto(id) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    try {
      const response = await fetch(`/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (response.ok) {
        adicionarNotificacao('Produto Excluido com sucesso!', 'A_Estoque.html');
        mostrarModal('Produto excluído com sucesso');
        carregarProdutos(); // Atualiza a lista
      } else {
        mostrarModal('Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      mostrarModal('Erro ao excluir produto');
    }
  }
}

function verDetalhes(id) {
  window.location.href = `A_DetalhesProduto.html?id=${id}`;
}

// 🔍 Filtra produtos com base no texto digitado
function filtrarProdutos() {
  const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

  const produtosFiltrados = produtos.filter(produto => {
    const nomeMatch = (produto.nome || '').toLowerCase().includes(termoPesquisa);
    const fornecedorMatch = (produto.fornecedor || '').toLowerCase().includes(termoPesquisa);
    const categoriaMatch = (produto.categoria || '').toLowerCase().includes(termoPesquisa);
    const vencimentoMatch = formatarData(produto.vencimento || '').toLowerCase().includes(termoPesquisa);
    const codigoBarrasMatch = String(produto.codigoBarras || '').toLowerCase().includes(termoPesquisa);

    return (
      nomeMatch ||
      fornecedorMatch ||
      categoriaMatch ||
      vencimentoMatch ||
      codigoBarrasMatch
    );
  });

  exibirProdutos(produtosFiltrados);
}

// Modal de mensagem
function mostrarModal(mensagem) {
  const modal = document.getElementById('modalExclusao');
  const mensagemModal = document.getElementById('mensagemModal');
  const span = document.getElementsByClassName('close')[0];

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  span.onclick = function () {
    modal.style.display = 'none';
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
}

// ✅ Tudo é iniciado aqui
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();

  const inputPesquisa = document.getElementById('pesquisa');
  if (inputPesquisa) {
    inputPesquisa.addEventListener('input', filtrarProdutos);
  }

  adicionarAcessoRecente('Estoque', 'A_Estoque.html', 'estoque');
});