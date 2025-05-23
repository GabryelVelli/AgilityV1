// Validação do código de barras EAN-13
function validarCodigoBarrasEAN13(codigo) {
    const numeros = codigo.replace(/\D/g, '');

    if (numeros.length !== 13) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 12; i++) {
        let num = parseInt(numeros[i], 10);
        soma += (i % 2 === 0) ? num : num * 3;
    }

    let digitoVerificadorCalculado = (10 - (soma % 10)) % 10;
    let digitoVerificadorReal = parseInt(numeros[12], 10);

    return digitoVerificadorCalculado === digitoVerificadorReal;
}

// Função para enviar o formulário
document.getElementById('produto-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value.trim();
    const codigoBarras = document.getElementById('codigoBarras').value.trim();
    const vencimento = document.getElementById('vencimento').value.trim();
    const quantidade = document.getElementById('quantidade').value.trim();
    const fornecedor = document.getElementById('fornecedor').value.trim();
    const categoria = document.getElementById('categoria').value.trim();

    // Validação do código de barras
    if (!validarCodigoBarrasEAN13(codigoBarras)) {
        mostrarModal('Código de barras inválido. Deve conter 13 números e dígito verificador correto.');
        return;
    }

    // Validação da data de vencimento (não pode ser anterior a hoje)
    const hoje = new Date();
    hoje.setHours(0,0,0,0); // Zerando hora para comparar só data
    const dataVencimento = new Date(vencimento);
    if (dataVencimento < hoje) {
        mostrarModal('Data de vencimento inválida. O produto não pode estar vencido.');
        return;
    }

    const produto = {
        nome,
        codigoBarras,
        vencimento,
        quantidade,
        fornecedor,
        categoria,
    };

    try {
        const resposta = await fetch('/add-produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Token armazenado no localStorage
            },
            body: JSON.stringify(produto)
        });

        if (resposta.status === 201) {
            adicionarNotificacao('Produto cadastrado com sucesso!', 'A_Estoque.html');
            mostrarModal('Produto cadastrado com sucesso!');
            document.getElementById('produto-form').reset(); // Limpa o formulário após sucesso
        } else {
            mostrarModal('Erro ao cadastrar produto');
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro ao cadastrar produto');
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
    };

    // Fecha o modal quando o usuário clica fora do conteúdo do modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    adicionarAcessoRecente('Produto', 'A_CadastroProduto.html', 'produto');
});
