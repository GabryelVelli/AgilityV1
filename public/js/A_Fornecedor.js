document.getElementById('estabelecimentoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nomeEstabelecimento = document.getElementById('nomeEstabelecimento').value;
    const cnpj = document.getElementById('cnpj').value;
    const contato = document.getElementById('contato').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const cep = document.getElementById('cep').value;

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
            adicionarNotificacao('Fornecedor Cadastrado com sucesso!', 'A_Fornecedor.html');
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