// Variável para armazenar todas as compras


// Função assíncrona para carregar compras
const compras = [
    { idcompras: 1, nome: "Teste", valor: 10, quantidade: 2, categoria: "Exemplo", prioridade: "Alta" }
];
exibirCompras(compras);


// Função para exibir as compras na tabela
function exibirCompras(compras) {
  const comprasContainer = document.getElementById('comprasContainer');
  comprasContainer.innerHTML = '';

  const tabela = document.createElement('table');
  tabela.style = "margin-left: 40px; width: 95%; border-collapse: collapse; color: black; table-layout: fixed;";
  tabela.innerHTML = `
      <thead>
          <tr style="background-color: #111827; color:white">
              <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Nome</th>
              <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Valor</th>
              <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Quantidade</th>
              <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Categoria</th>
              <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Prioridade</th>
              <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Ações</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
  `;

  comprasContainer.appendChild(tabela);

  const tabelaBody = tabela.querySelector('tbody');
  compras.forEach(compra => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
          <td style="border: 1px solid #848484; padding: 8px;">${compra.idcompras}</td>
          <td style="border: 1px solid #848484; padding: 8px;">${compra.nome}</td>
          <td style="border: 1px solid #848484; padding: 8px;">R$ ${compra.valor}</td>
          <td style="border: 1px solid #848484; padding: 8px;">${compra.quantidade}</td>
          <td style="border: 1px solid #848484; padding: 8px;">${compra.categoria}</td>
          <td style="border: 1px solid #848484; padding: 8px;">${compra.prioridade}</td>
          <td style="border: 1px solid #848484; padding: 8px; text-align: center;">
              <button onclick="excluirCompra(${compra.idCompras})">Excluir</button>
          </td>
      `;
      tabelaBody.appendChild(linha);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  carregarCompras();  // Carrega as compras assim que a página carrega
});

// Função para excluir compra
async function excluirCompra(idcompras) {
  try {
      const response = await fetch(`/compras/${idcompras}`, {
          method: 'DELETE',
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json',
          }
      });

      if (response.ok) {
          mostrarModal('Compra excluída com sucesso');
          carregarCompras();
      } else {
          mostrarModal('Erro ao excluir compra');
      }
  } catch (error) {
      console.error('Erro:', error);
      mostrarModal('Erro ao excluir compra');
  }
}
// Função para editar compra
async function editarCompra(id) {
  const nome = prompt('Novo nome:');
  const valor = prompt('Novo valor:');
  const quantidade = prompt('Nova quantidade:');
  const categoria = prompt('Nova categoria:');
  const prioridade = prompt('Nova prioridade:');

  if (!nome || !valor || !quantidade || !categoria || !prioridade) return;

  await fetch(`/editar-compra/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      nome,
      valor: parseFloat(valor),
      quantidade: parseInt(quantidade),
      categoria,
      prioridade
    })
  });

  carregarCompras();  // Atualiza a lista após editar
}
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