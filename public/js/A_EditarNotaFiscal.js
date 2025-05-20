
  let id;
  document.addEventListener('DOMContentLoaded', async () => {
       id = new URLSearchParams(window.location.search).get('id');
       
    if (!id) {
     mostrarModal('ID da nota não fornecido.');
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/nota/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!resposta.ok) {
        throw new Error('Nota não encontrada');
      }

      const nota = await resposta.json();

      // Preenche os campos do formulário com os dados da nota
      document.getElementById('numero').value = nota.Numero;
      document.getElementById('serie').value = nota.Serie;
      document.getElementById('data_emissao').value = nota.data_emissao.split('T')[0]; // Formato yyyy-mm-dd
      document.getElementById('valor_total').value = nota.Valor_total;
      document.getElementById('fornecedor').value = nota.Fornecedor;

    } catch (error) {
      console.error('Erro ao carregar nota fiscal:', error);
      mostrarModal('Erro ao carregar nota fiscal: ' + error.message);
    }

    // Evento de envio do formulário
    document.getElementById('nota-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const Numero = document.getElementById('numero').value;
      const Serie = document.getElementById('serie').value;
      const data_emissao = document.getElementById('data_emissao').value;
      const Valor_total = document.getElementById('valor_total').value;
      const Fornecedor = document.getElementById('fornecedor').value;

      const notaAtualizada = { Numero, Serie, data_emissao, Valor_total, Fornecedor };

      try {
        const resposta = await fetch(`http://localhost:3000/nota/editar/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(notaAtualizada)
        });

        if (resposta.ok) {
          adicionarNotificacao('Nota Fiscal Atualizada com sucesso!', 'A_NotaFiscal.html');
          mostrarModal('Nota fiscal atualizada com sucesso!');
          setTimeout(() => {
          window.location.href = 'A_NotaFiscal.html';
        }, 1000) // redireciona se quiser
        } else {
          const msg = await resposta.text();
         mostrarModal('Erro ao atualizar nota: ' + msg);
        }
      } catch (error) {
        console.error('Erro ao enviar atualização:', error);
        mostrarModal('Erro ao enviar atualização: ' + error.message);
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
