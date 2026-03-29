let produtos = [];

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
      produtos = await response.json();
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

function exibirProdutos(listaProdutos) {
  const tbody = document.getElementById('tabela-produtos');
  tbody.innerHTML = '';

  listaProdutos.forEach((produto) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center;">
        ${createActionMenu([
          { label: 'Detalhe', action: `verDetalhes(${produto.idproduto})` },
          { label: 'Editar', action: `editarProduto(${produto.idproduto})` },
          { label: 'Excluir', action: `excluirProduto(${produto.idproduto})`, danger: true },
          { label: 'Movimentar', action: `abrirModalMovimentacao(${produto.idproduto})` }
        ])}
      </td>
      <td>${produto.nome}</td>
      <td>${produto.codigoBarras}</td>
      <td>${formatarData(produto.vencimento)}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.fornecedor}</td>
      <td style="text-align: left">${produto.categoria}</td>
    `;
    tbody.appendChild(tr);
  });
}

function editarProduto(id) {
  window.location.href = `/view/Produtos/A_EditarProduto.html?id=${id}`;
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
        adicionarNotificacao('Produto Excluído com sucesso!', '/view/Produtos/A_Estoque.html');
        mostrarModal('Produto excluído com sucesso');
        carregarProdutos();
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
  window.location.href = `/view/Produtos/A_DetalhesProduto.html?id=${id}`;
}

function filtrarProdutos() {
  const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

  const produtosFiltrados = produtos.filter((produto) => {
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

function abrirModalMovimentacao(idproduto) {
  const modal = document.getElementById('modalMovimentacao');
  const span = modal.getElementsByClassName('close')[0];

  document.getElementById('idprodutoMovimentacao').value = idproduto;
  modal.style.display = 'block';

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function fecharModalMovimentacao() {
  document.getElementById('modalMovimentacao').style.display = 'none';
}

async function registrarMovimentacao() {
  const idproduto = document.getElementById('idprodutoMovimentacao').value;
  const tipo = document.getElementById('tipoMovimentacao').value;
  const quantidade = parseInt(document.getElementById('quantidadeMovimentacao').value, 10);
  const observacao = document.getElementById('observacaoMovimentacao').value;
  const token = localStorage.getItem('token');

  if (!quantidade || quantidade <= 0) {
    mostrarModal('Quantidade inválida.');
    return;
  }

  try {
    const resposta = await fetch('/estoque/movimentar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ idproduto, tipo, quantidade, observacao })
    });

    const texto = await resposta.text();
    mostrarModal(texto);

    if (resposta.ok) {
      fecharModalMovimentacao();
      carregarProdutos();
    }
  } catch (erro) {
    console.error(erro);
    mostrarModal('Erro ao registrar movimentação.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();

  const inputPesquisa = document.getElementById('pesquisa');
  if (inputPesquisa) {
    inputPesquisa.addEventListener('input', filtrarProdutos);
  }

  adicionarAcessoRecente('Estoque', '/view/Produtos/A_Estoque.html', 'estoque');
});

