document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('ID do fornecedor não informado');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    // Busca os dados do fornecedor
    const response = await fetch(`/estabelecimento-detalhes/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();

    // Preenche o formulário com os dados recebidos
    document.getElementById('nomeEstabelecimento').value = data.estabelecimento.nomeEstabelecimento || data.estabelecimento.nome || '';
    document.getElementById('cnpj').value = data.estabelecimento.CNPJ || '';
    document.getElementById('contato').value = data.estabelecimento.contato || '';
    document.getElementById('logradouro').value = data.unidade.logradouro || '';
    document.getElementById('numero').value = data.unidade.numero || '';
    document.getElementById('bairro').value = data.unidade.bairro || '';
    document.getElementById('cidade').value = data.unidade.cidade || '';
    document.getElementById('cep').value = data.unidade.CEP || '';
  } catch (err) {
    console.error('Erro ao carregar dados do fornecedor:', err.message);
    alert('Erro ao carregar dados do fornecedor.');
  }

  // Evento para enviar a atualização
  document.getElementById('editar-fornecedor-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      nomeEstabelecimento: document.getElementById('nomeEstabelecimento').value,
      cnpj: document.getElementById('cnpj').value,
      contato: document.getElementById('contato').value,
      logradouro: document.getElementById('logradouro').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value,
      cidade: document.getElementById('cidade').value,
      cep: document.getElementById('cep').value,
    };

    try {
      const response = await fetch(`/estabelecimentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (response.ok) {
        adicionarNotificacao('Fornecedor Atualizado com sucesso!', 'A_Fornecedor.html');
        mostrarModal('Fornecedor atualizado com sucesso!');
        setTimeout(() => {
          window.location.href = 'A_Fornecedores.html';
        }, 1000);
      } else {
        const erro = await response.text();
        mostrarModal('Erro ao atualizar: ' + erro);
      }
    } catch (err) {
      console.error('Erro ao atualizar fornecedor:', err.message);
      mostrarModal('Erro inesperado ao atualizar.');
    }
  });
});

// Função para exibir o modal com mensagem
function mostrarModal(mensagem) {
  const modal = document.getElementById('modalExclusao');
  const mensagemModal = document.getElementById('mensagemModal');
  const span = document.getElementsByClassName('close')[0];

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
