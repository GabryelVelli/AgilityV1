document.addEventListener('DOMContentLoaded', async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const token = localStorage.getItem('token');

      if (!id) {
        mostrarModal('ID do produto não informado');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/produtos/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(await response.text());

        const produto = await response.json();

        document.getElementById('nome').value = produto.nome;
        document.getElementById('codigoBarras').value = produto.codigoBarras;
        document.getElementById('vencimento').value = produto.vencimento.split('T')[0];
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('fornecedor').value = produto.fornecedor;
        document.getElementById('categoria').value = produto.categoria;
      } catch (err) {
        mostrarModal('Erro ao carregar produto: ' + err.message);
      }

      document.getElementById('produto-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
          nome: document.getElementById('nome').value,
          codigoBarras: document.getElementById('codigoBarras').value,
          vencimento: document.getElementById('vencimento').value,
          quantidade: parseInt(document.getElementById('quantidade').value),
          fornecedor: document.getElementById('fornecedor').value,
          categoria: document.getElementById('categoria').value
        };

        try {
          const response = await fetch(`http://localhost:3000/produtos/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
          });

          if (response.ok) {
            adicionarNotificacao('Produto Editado com sucesso!', 'A_Estoque.html');
            mostrarModal('Produto atualizado com sucesso!');

            // Espera 2 segundos antes de redirecionar
            setTimeout(() => {
                window.location.href = 'A_Estoque.html';
            }, 1000);
        }
        } catch (err) {
           mostrarModal('Erro inesperado ao atualizar produto.');
        }
      });
    });
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