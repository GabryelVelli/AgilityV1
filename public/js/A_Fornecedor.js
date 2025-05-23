// Máscara automática para CNPJ
const cnpjInput = document.getElementById('cnpj');

cnpjInput.addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove tudo que não for número
    value = value.replace(/\D/g, '');

    // Aplica a máscara: XX.XXX.XXX/0001-XX
    if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    }
    if (value.length > 13) {
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
    }

    e.target.value = value;
});

// Função para validar CNPJ
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g,'');
  if(cnpj.length !== 14) return false;
  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0,tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if(pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if(resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0,tamanho);
  soma = 0;
  pos = tamanho - 7;

  for(let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if(pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if(resultado != digitos.charAt(1)) return false;

  return true;
}

document.getElementById('estabelecimentoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nomeEstabelecimento = document.getElementById('nomeEstabelecimento').value;
    const cnpjMascara = document.getElementById('cnpj').value;
    const cnpj = cnpjMascara.replace(/\D/g, ''); // Remove máscara para validar corretamente
    const contato = document.getElementById('contato').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const cep = document.getElementById('cep').value;

    // Validação do CNPJ antes do envio
    if (!validarCNPJ(cnpj)) {
        alert('CNPJ inválido. Por favor, verifique e tente novamente.');
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
            adicionarNotificacao('Fornecedor Cadastrado com sucesso!', 'A_Fornecedores.html');
            mostrarModal('Fornecedor cadastrado com sucesso!');
            document.getElementById('estabelecimentoForm').reset();
        } else {
            mostrarModal('Erro ao cadastrar fornecedor: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarModal('Erro ao conectar ao servidor.');
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
span.onclick = function() {
    modal.style.display = 'none';
}

// Fecha o modal quando o usuário clica fora do conteúdo do modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
}
document.addEventListener('DOMContentLoaded', () => {
  adicionarAcessoRecente('Fornecedor', 'A_Fornecedor.html', 'fornecedor');
});