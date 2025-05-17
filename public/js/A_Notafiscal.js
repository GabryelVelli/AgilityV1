  async function carregarNotas() {
      try {
        const resposta = await fetch('http://localhost:3000/nota/listar', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!resposta.ok) throw new Error('Erro ao buscar notas fiscais');

        const notas = await resposta.json();
        const tabela = document.getElementById('tabela-notas');
        tabela.innerHTML = '';

        notas.forEach(nota => {
          const linha = document.createElement('tr');
          linha.innerHTML = `
            <td>${nota.Numero}</td>
            <td>${nota.Serie}</td>
            <td>${new Date(nota.data_emissao).toLocaleDateString()}</td>
            <td>R$ ${nota.Valor_total.toFixed(2)}</td>
            <td>${nota.Fornecedor || ''}</td>
            <td>
              <button class="btn-detalhes" onclick="verDetalhes(${nota.IDnota})">Detalhes</button>
              <button class="btn-editar" onclick="editarNota(${nota.IDnota})">Editar</button>
              <button class="btn-excluir" onclick="excluirNota(${nota.IDnota})">Excluir</button>
            </td>
          `;
          tabela.appendChild(linha);
        });
      } catch (error) {
        mostrarModal('Erro ao carregar notas fiscais: ' + error.message);
      }
    }

    async function excluirNota(id) {
      if (!confirm('Tem certeza que deseja excluir esta nota?')) return;

      try {
        const resposta = await fetch(`http://localhost:3000/nota/excluir/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (resposta.ok) {
          adicionarNotificacao('Nota Fiscal Excluida com sucesso!', 'A_NotaFiscal.html');
         mostrarModal('Nota Fiscal excluída com sucesso');
          carregarNotas();
        } else {
          mostrarModal('Erro ao excluir nota');
        }
      } catch (err) {
        console.error('Erro ao excluir nota:', err.message);
        mostrarModal('Erro ao excluir nota');
      }
    }

    function editarNota(id) {
      // Aqui você pode redirecionar para uma página de edição com o ID da nota na URL
      window.location.href = `A_EditarNotaFiscal.html?id=${id}`;
    }
    function verDetalhes(id) {
      window.location.href = `A_DetalhesNotaFiscal.html?id=${id}`;
    }
// Carrega notas assim que a página abrir
    carregarNotas();
       // Função para exibir o modal com a mensagem
    function mostrarModal(mensagem) {
        const modal = document.getElementById('modalExclusao');
        const mensagemModal = document.getElementById('mensagemModal');
        const span = document.getElementsByClassName('close')[0];

        mensagemModal.textContent = mensagem;
        modal.style.display = 'block';

        // Fecha o modal quando o usuário clica no "x"
        span.onclick = function () {
            modal.style.display = 'none';
        }

        // Fecha o modal quando o usuário clica fora do conteúdo do modal
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
document.addEventListener('DOMContentLoaded', () => {
  adicionarAcessoRecente('Nota Fiscal', 'A_NotaFiscal.html', 'notafiscal');
});