 let compras = [];

    async function carregarCompras() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/compras/listar', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(await response.text());

        compras = await response.json();
        exibirCompras(compras);
      } catch (err) {
        console.error('Erro ao carregar compras:', err.message);
        mostrarModal('Erro ao buscar compras');
      }
    }

    function exibirCompras(lista) {
      const tabela = document.getElementById('tabela-compras');
      tabela.innerHTML = '';

      lista.forEach(compra => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${compra.nome}</td>
          <td>R$ ${isNaN(Number(compra.valor)) ? '0.00' : Number(compra.valor).toFixed(2)}</td>
          <td>${compra.quantidade}</td>
          <td>${compra.prioridade}</td>
          <td>${compra.categoria}</td>
          <td style="text-align: center;">
            <button class="btn-detalhes" onclick="verDetalhes(${compra.IDCompras})">Detalhes</button>
            <button class="btn-editar" onclick="editarCompra(${compra.IDCompras})">Editar</button>
            <button class="btn-excluir" onclick="excluirCompra(${compra.IDCompras})">Excluir</button>
          </td>
        `;
        tabela.appendChild(tr);
      });
    }

    function filtrarCompras() {
      const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

      const filtrados = compras.filter(compra => {
        return (
          (compra.nome || '').toLowerCase().includes(termoPesquisa) ||
          (compra.categoria || '').toLowerCase().includes(termoPesquisa) ||
          (compra.prioridade || '').toLowerCase().includes(termoPesquisa)
        );
      });

      exibirCompras(filtrados);
    }

    async function excluirCompra(id) {
      if (!confirm('Deseja excluir esta compra?')) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/compras/excluir/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          adicionarNotificacao('Compra Excluída com sucesso!', 'A_Compras.html');
          mostrarModal('Compra excluída com sucesso');
          carregarCompras();
        } else {
          mostrarModal('Erro ao excluir: ' + (await response.text()));
        }
      } catch (err) {
        console.error('Erro ao excluir:', err.message);
        mostrarModal('Erro inesperado ao excluir.');
      }
    }

    function editarCompra(id) {
      window.location.href = `A_EditarCompra.html?id=${id}`;
    }

    function verDetalhes(id) {
      window.location.href = `A_DetalhesCompra.html?id=${id}`;
    }

    // Modal
    function mostrarModal(mensagem) {
      const modal = document.getElementById('modalExclusao');
      const mensagemModal = document.getElementById('mensagemModal');
      const span = document.getElementsByClassName('close')[0];

      mensagemModal.textContent = mensagem;
      modal.style.display = 'block';

      span.onclick = function() {
        modal.style.display = 'none';
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    }

    // Função fictícia, ajuste conforme seu código
    function adicionarNotificacao(msg, url) {
      console.log('Notificação:', msg);
      // Se quiser, pode implementar um sistema real de notificações
      // e/ou redirecionar para url
    }

    document.addEventListener('DOMContentLoaded', carregarCompras);