document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = localStorage.getItem('token');

  if (!id) {
    mostrarModal('ID do fornecedor não informado');
    return;
  }

  try {
    const response = await fetch(`/estabelecimentos/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(await response.text());

    const fornecedor = await response.json();

    document.getElementById('nome').textContent = fornecedor.nome;
    document.getElementById('cnpj').textContent = fornecedor.CNPJ;
    document.getElementById('contato').textContent = fornecedor.contato;
    document.getElementById('logradouro').textContent = fornecedor.logradouro;
    document.getElementById('numero').textContent = fornecedor.numero;
    document.getElementById('bairro').textContent = fornecedor.bairro;
    document.getElementById('cidade').textContent = fornecedor.cidade;
    document.getElementById('cep').textContent = fornecedor.cep;

  } catch (err) {
    mostrarModal('Erro ao carregar fornecedor: ' + err.message);
  }

  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.location.href = '/view/Fornecedores/A_Fornecedores.html';
  });

  document.getElementById('btn-editar').addEventListener('click', () => {
    window.location.href = `/view/Fornecedores/A_EditarFornecedor.html?id=${id}`;
  });
});

