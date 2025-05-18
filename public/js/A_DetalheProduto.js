document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token'); // caso use token

  if (!id) {
    alert('ID do fornecedor não informado');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/estabelecimentos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const fornecedor = await response.json();

    document.getElementById('nomeEstabelecimento').textContent = fornecedor.nomeEstabelecimento || fornecedor.nome || '';
    document.getElementById('cnpj').textContent = fornecedor.CNPJ || '';
    document.getElementById('contato').textContent = fornecedor.contato || '';
    document.getElementById('logradouro').textContent = fornecedor.logradouro || '';
    document.getElementById('numero').textContent = fornecedor.numero || '';
    document.getElementById('bairro').textContent = fornecedor.bairro || '';
    document.getElementById('cidade').textContent = fornecedor.cidade || '';
    document.getElementById('cep').textContent = fornecedor.CEP || '';

  } catch (err) {
    mostrarModal('Erro ao carregar fornecedor: ' + err.message);
  }

  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = 'A_Fornecedores.html'; // Ajuste sua página de lista
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    window.location.href = `A_EditarFornecedor.html?id=${id}`; // Ajuste sua página de edição
  });
});

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