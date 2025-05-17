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
      const produtos = await response.json();
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
    // Função para filtrar produtos com base no texto digitado na barra de pesquisa
    function filtrarProdutos() {
        const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

        // Filtra os produtos com base no nome, fornecedor, categoria e vencimento
        const produtosFiltrados = produtos.filter(produto => {
        const nomeMatch = produto.nome.toLowerCase().includes(termoPesquisa);
        const fornecedorMatch = produto.fornecedor.toLowerCase().includes(termoPesquisa);
        const categoriaMatch = produto.categoria.toLowerCase().includes(termoPesquisa);
        const vencimentoMatch = formatarData(produto.vencimento).toLowerCase().includes(termoPesquisa);

        // Retorna true se algum campo corresponder ao termo de pesquisa
        return nomeMatch || fornecedorMatch || categoriaMatch || vencimentoMatch;
    });
        // Exibe os produtos filtrados
        exibirProdutos(produtosFiltrados);
    }

    document.addEventListener('DOMContentLoaded', () => {
        carregarProdutos();
    });

    // Função para exibir o modal com a mensagem
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
document.addEventListener('DOMContentLoaded', () => {
  adicionarAcessoRecente('Estoque', 'A_Estoque.html', 'estoque');
});


