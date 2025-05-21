let notas = [];

    async function carregarNotas() {
      try {
        const resposta = await fetch('/nota/listar', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!resposta.ok) throw new Error('Erro ao buscar notas fiscais');

        notas = await resposta.json();
        exibirNotas(notas);
      } catch (error) {
        mostrarModal('Erro ao carregar notas fiscais: ' + error.message);
      }
    }

    function exibirNotas(lista) {
      const tabela = document.getElementById('tabela-notas');
      tabela.innerHTML = '';

      lista.forEach(nota => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${nota.Numero}</td>
          <td>${nota.Serie}</td>
          <td>${new Date(nota.data_emissao).toLocaleDateString()}</td>
          <td>R$ ${Number(nota.Valor_total).toFixed(2)}</td>
          <td>${nota.Fornecedor || ''}</td>
          <td style="text-align:center;">
            <button class="btn-detalhes" onclick="verDetalhes(${nota.IDnota})">Detalhes</button>
            <button class="btn-editar" onclick="editarNota(${nota.IDnota})">Editar</button>
            <button class="btn-excluir" onclick="excluirNota(${nota.IDnota})">Excluir</button>
          </td>
        `;
        tabela.appendChild(linha);
      });
    }

    function filtrarNotas() {
      const termo = document.getElementById('pesquisa').value.toLowerCase();

      const filtradas = notas.filter(nota => {
        return (
          (nota.Numero?.toString().toLowerCase().includes(termo)) ||
          (nota.Serie?.toString().toLowerCase().includes(termo)) ||
          (nota.Fornecedor?.toLowerCase().includes(termo)) ||
          (new Date(nota.data_emissao).toLocaleDateString().toLowerCase().includes(termo))
        );
      });

      exibirNotas(filtradas);
    }

    async function excluirNota(id) {
      if (!confirm('Tem certeza que deseja excluir esta nota?')) return;

      try {
        const resposta = await fetch(`/nota/excluir/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (resposta.ok) {
          adicionarNotificacao('Nota Fiscal Excluída com sucesso!', 'A_NotaFiscal.html');
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
      window.location.href = `A_EditarNotaFiscal.html?id=${id}`;
    }
    function verDetalhes(id) {
      window.location.href = `A_DetalhesNotaFiscal.html?id=${id}`;
    }

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

    // Função fictícia para notificações
    function adicionarNotificacao(msg, url) {
      console.log('Notificação:', msg);
    }

    document.addEventListener('DOMContentLoaded', () => {
      carregarNotas();
      adicionarAcessoRecente?.('Nota Fiscal', 'A_NotaFiscal.html', 'notafiscal');
    });