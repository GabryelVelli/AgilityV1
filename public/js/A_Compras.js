let compras = [];

async function carregarCompras() {
    try {
        const response = await fetch('/compras', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            compras = await response.json();
            exibirCompras(compras);
        } else {
            mostrarModal('Erro ao carregar compras');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarModal('Erro ao carregar compras');
    }
}

function exibirCompras(lista) {
    const comprasContainer = document.getElementById('comprasContainer');
    comprasContainer.innerHTML = '';

    const tabela = document.createElement('table');
    tabela.style = "margin: 20px auto; width: 95%; border-collapse: collapse; color: black; table-layout: fixed;";
    tabela.innerHTML = `
        <thead>
            <tr style="background-color: #111827; color: white;">
                <th style="border: 1px solid #848484; padding: 8px;">Nome</th>
                <th style="border: 1px solid #848484; padding: 8px;">Valor</th>
                <th style="border: 1px solid #848484; padding: 8px;">Quantidade</th>
                <th style="border: 1px solid #848484; padding: 8px;">Prioridade</th>
                <th style="border: 1px solid #848484; padding: 8px;">Categoria</th>
                <th style="border: 1px solid #848484; padding: 8px;">Ações</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    comprasContainer.appendChild(tabela);

    const tabelaBody = tabela.querySelector('tbody');
    lista.forEach(compra => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid #848484; padding: 8px;">${compra.nome}</td>
            <td style="border: 1px solid #848484; padding: 8px;">R$ ${parseFloat(compra.valor).toFixed(2)}</td>
            <td style="border: 1px solid #848484; padding: 8px;">${compra.quantidade}</td>
            <td style="border: 1px solid #848484; padding: 8px;">${compra.prioridade}</td>
            <td style="border: 1px solid #848484; padding: 8px;">${compra.categoria}</td>
            <td style="border: 1px solid #848484; padding: 8px; text-align: center;">
                <button class="excluir" onclick="excluirCompra(${compra.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

async function excluirCompra(id) {
    try {
        const response = await fetch(`/compras/${id}`, {
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

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarCompras();
});


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