// Função para enviar o formulário
    document.getElementById('product-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const nome = document.getElementById('nome').value;
        const codigoBarras = document.getElementById('codigoBarras').value;
        const vencimento = document.getElementById('vencimento').value;
        const quantidade = document.getElementById('quantidade').value;
        const fornecedor = document.getElementById('fornecedor').value;
        const categoria = document.getElementById('categoria').value;

        const produto = {
            nome,
            codigoBarras,
            vencimento,
            quantidade,
            fornecedor,
            categoria,
        };

        try {
            const resposta = await fetch('http://localhost:3000/add-produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Supondo que você tenha o token armazenado
                },
                body: JSON.stringify(produto)
            });

            if (resposta.status === 201) {
                mostrarModal('Produto cadastrado com sucesso!');
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
        }

        // Fecha o modal quando o usuário clica fora do conteúdo do modal
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
