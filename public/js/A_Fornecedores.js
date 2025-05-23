let estabelecimentos = [];

async function carregarEstabelecimentos() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/estabelecimentos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');

    estabelecimentos = await response.json(); // Salva globalmente
    exibirEstabelecimentos(estabelecimentos); // Mostra todos inicialmente

  } catch (err) {
    console.error(err);
    alert("Erro ao carregar Fornecedor.");
  }
}

function formatarCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, ''); // remove tudo que não é número
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, 
    "$1.$2.$3/$4-$5");
}

function exibirEstabelecimentos(lista) {
  const tabela = document.getElementById('tabela-estabelecimentos');
  tabela.innerHTML = ''; // Limpa a tabela

  lista.forEach(est => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${est.nome}</td>
      <td>${formatarCNPJ(est.CNPJ)}</td>
      <td>${est.contato}</td>
      <td>${est.logradouro}</td>
      <td>${est.numero}</td>
      <td>${est.bairro}</td>
      <td>${est.cidade}</td>
      <td>${est.cep}</td>
      <td>
          <button class="btn-detalhes" onclick="verDetalhes(${est.IDestabelecimento}, ${est.idunidade})">Detalhes</button>
          <button class="btn-editar" onclick="editarEstabelecimento(${est.IDestabelecimento}, ${est.idunidade})">Editar</button>
          <button class="btn-excluir" onclick="excluirEstabelecimento(${est.IDestabelecimento})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function filtrarFornecedor() {
  const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

  const filtrados = estabelecimentos.filter(est => {
    return (
      (est.nome || '').toLowerCase().includes(termoPesquisa) ||
      (est.CNPJ || '').toLowerCase().includes(termoPesquisa) ||
      (est.cidade || '').toLowerCase().includes(termoPesquisa) ||
      (est.bairro || '').toLowerCase().includes(termoPesquisa)
    );
  });

  exibirEstabelecimentos(filtrados);
}

async function excluirEstabelecimento(id) {
  if (!confirm('Deseja excluir este Fornecedor?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/estabelecimentos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      mostrarModal('Fornecedor excluído com sucesso!');

      // Aguarda 1 segundo antes de recarregar a página
      setTimeout(() => {
        adicionarNotificacao('Fornecedor Excluido com sucesso!', 'A_Fornecedor.html');
        location.reload();
      }, 1000);
    } else {
      mostrarModal('Erro ao excluir: ' + (await response.text()));
    }
  } catch (err) {
    console.error('Erro ao excluir:', err.message);
    mostrarModal('Erro inesperado ao excluir.');
  }
}

function editarEstabelecimento(id) {
  window.location.href = `A_EditarFornecedor.html?id=${id}`;
}

function verDetalhes(id) {
  window.location.href = `A_DetalhesFornecedores.html?id=${id}`;
}

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
  carregarEstabelecimentos();
  // Pode colocar outras funções que queira rodar após carregamento aqui
});
