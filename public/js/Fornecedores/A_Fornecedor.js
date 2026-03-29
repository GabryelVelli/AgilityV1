const cnpjInput = document.getElementById('cnpj');

document.getElementById('estabelecimentoForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const nomeEstabelecimento = document.getElementById('nomeEstabelecimento').value;
  const cnpjMascara = cnpjInput.value;
  const cnpj = documentoMixin.removerCaracteresNaoNumericos(cnpjMascara);
  const contato = document.getElementById('contato').value;
  const logradouro = document.getElementById('logradouro').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  const cep = document.getElementById('cep').value;

  if (!documentoMixin.validarCNPJ(cnpj)) {
    cnpjInput.focus();
    mostrarModal('CNPJ inválido. Por favor, verifique e tente novamente.');
    return;
  }

  try {
    const response = await fetch('/add-estabelecimento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        nomeEstabelecimento,
        cnpj,
        contato,
        logradouro,
        numero,
        bairro,
        cidade,
        cep
      })
    });

    if (response.ok) {
      adicionarNotificacao('Fornecedor Cadastrado com sucesso!', '/view/Fornecedores/A_Fornecedores.html');
      mostrarModal('Fornecedor cadastrado com sucesso!');
      document.getElementById('estabelecimentoForm').reset();
      documentoMixin.inicializarCampoDocumento(cnpjInput);
    } else {
      mostrarModal('Erro ao cadastrar fornecedor: ' + response.statusText);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarModal('Erro ao conectar ao servidor.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  adicionarAcessoRecente('Fornecedor', '/view/Fornecedores/A_Fornecedor.html', 'fornecedor');
});

