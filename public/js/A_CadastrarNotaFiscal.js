document.getElementById('nota-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const Numero = document.getElementById('numero').value;
  const Serie = document.getElementById('serie').value;
  const data_emissao = document.getElementById('data_emissao').value;
  const Valor_total = document.getElementById('valor_total').value;
  const Fornecedor = document.getElementById('fornecedor').value;

  const notaFiscal = {
    Numero,
    Serie,
    data_emissao,
    Valor_total,
    Fornecedor
  };

  try {
      const resposta = await fetch('/nota/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(notaFiscal)
    });

    if (resposta.status === 201) {
      mostrarModal('Nota fiscal cadastrada com sucesso!');
      document.getElementById('nota-form').reset();

      // Adiciona notificação
      adicionarNotificacao('Nota fiscal cadastrada com sucesso!', 'A_NotaFiscal.html');
    } else {
      const erro = await resposta.text();
      mostrarModal('Erro ao cadastrar nota fiscal: ' + erro);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarModal('Erro ao cadastrar nota fiscal.');
  }
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
