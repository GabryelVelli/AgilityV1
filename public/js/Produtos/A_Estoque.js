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
      <td style="text-align: center; position: relative;">
        <div class="menu-container">
          <button class="hamburger-btn" onclick="toggleMenu(this)">
            ☰
          </button>
          <div class="dropdown-menu">
            <button onclick="verDetalhes(${produto.idproduto})">Detalhes</button>
            <button onclick="editarProduto(${produto.idproduto})">Editar</button>
            <button onclick="excluirProduto(${produto.idproduto})">Excluir</button>
            <button onclick="abrirModalMovimentacao(${produto.idproduto})">Movimentar</button>
          </div>
        </div>
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
function toggleMenu(button) {
  const menu = button.nextElementSibling;
  const isVisible = menu.classList.contains('show');

  // Fecha todos os outros menus abertos
  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));

  // Alterna visibilidade do menu clicado
  if (!isVisible) {
    menu.classList.add('show');
  }
}

// Fecha o menu se clicar fora
document.addEventListener('click', function(event) {
  if (!event.target.closest('.menu-container')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  }
});
function editarProduto(id) {
  window.location.href = `/view/Produtos/A_EditarProduto.html?id=${id}`;
}
//<button class="btn-editar" onclick="abrirModalMovimentacao(${produto.idproduto})">Movimentar</button>
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
        adicionarNotificacao('Produto Excluido com sucesso!', '/view/Produtos/A_Estoque.html');
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
  window.location.href = `/view/Produtos/A_DetalhesProduto.html?id=${id}`;
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
function abrirModalMovimentacao(idproduto) {
  const modal = document.getElementById('modalMovimentacao');
  const span = modal.getElementsByClassName('close')[0];

  // Armazena o ID do produto no input oculto
  document.getElementById('idprodutoMovimentacao').value = idproduto;

  modal.style.display = 'block';

  // Fecha ao clicar no "X"
  span.onclick = function () {
    modal.style.display = 'none';
  };

  // Fecha ao clicar fora do conteúdo do modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}


// Função para fechar via outro botão, se desejar
function fecharModalMovimentacao() {
  document.getElementById('modalMovimentacao').style.display = 'none';
}

async function registrarMovimentacao() {
  const idproduto = document.getElementById('idprodutoMovimentacao').value;
  const tipo = document.getElementById('tipoMovimentacao').value;
  const quantidade = parseInt(document.getElementById('quantidadeMovimentacao').value);
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
      // recarrega produtos ou atualiza quantidade
      carregarProdutos(); 
    }
  } catch (erro) {
    console.error(erro);
    mostrarModal('Erro ao registrar movimentação.');
  }
}
// ✅ Tudo é iniciado aqui
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();

  const inputPesquisa = document.getElementById('pesquisa');
  if (inputPesquisa) {
    inputPesquisa.addEventListener('input', filtrarProdutos);
  }

  adicionarAcessoRecente('Estoque', '/view/Produtos/A_Estoque.html', 'estoque');
});

