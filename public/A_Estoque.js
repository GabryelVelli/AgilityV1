    // Variável para armazenar todos os produtos
    let produtos = [];

    // Função para formatar a data
    function formatarData(data) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatoData = new Date(data).toLocaleDateString('pt-BR', options);
        return formatoData;
    }

    // Função assíncrona para carregar produtos
    async function carregarProdutos() {
        try {
            const response = await fetch('/produtos', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                produtos = await response.json(); // Armazena os produtos globalmente

                // Exibe os produtos ao carregar
                exibirProdutos(produtos);
            } else {
                mostrarModal('Erro ao carregar produtos');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarModal('Erro ao carregar produtos');
        }
    }

        function exibirProdutos(produtos) {
        const produtosContainer = document.getElementById('produtosContainer');
        produtosContainer.innerHTML = ''; // Limpa o conteúdo antes de adicionar os novos produtos

        // Adiciona o cabeçalho da tabela uma única vez
        const tabela = document.createElement('table');
        tabela.style = "width: 95%; border-collapse: collapse; color: black; table-layout: fixed;";
        tabela.innerHTML = `
            <thead>
                <tr style="background-color: #6E6E6E;">
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Nome</th>
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Código de Barras</th>
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Vencimento</th>
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Quantidade</th>
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Fornecedor</th>
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Categoria</th>
                    <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Ações</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        // Adiciona a tabela ao container
        produtosContainer.appendChild(tabela);

        // Adiciona os produtos na tabela
        const tabelaBody = tabela.querySelector('tbody');
        produtos.forEach(produto => {
            const produtoRow = document.createElement('tr');
            produtoRow.innerHTML = `
                <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${produto.nome}</td>
                <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${produto.codigoBarras}</td>
                <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${formatarData(produto.vencimento)}</td>
                <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${produto.quantidade}</td>
                <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${produto.fornecedor}</td>
                <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${produto.categoria}</td>
                <td style="border: 1px solid #848484; padding: 8px; text-align: center;">
                    <button class="excluir" onclick="excluirProduto(${produto.idproduto})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tabelaBody.appendChild(produtoRow);
        });
    }

    // Função para filtrar produtos com base no texto digitado na barra de pesquisa
    function filtrarProdutos() {
        const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();

        // Filtra os produtos com base no nome, fornecedor, categoria e vencimento
        const produtosFiltrados = produtos.filter(produto => {
        const nomeMatch = produto.nome.toLowerCase().includes(termoPesquisa);
        const fornecedorMatch = produto.fornecedor.toLowerCase().includes(termoPesquisa);
        const categoriaMatch = produto.categoria.toLowerCase().includes(termoPesquisa);
        const vencimentoMatch = formatarData(produto.vencimento).toLowerCase().includes(termoPesquisa);

        // Retorna true se algum campo corresponder ao termo de pesquisa
        return nomeMatch || fornecedorMatch || categoriaMatch || vencimentoMatch;
    });
        // Exibe os produtos filtrados
        exibirProdutos(produtosFiltrados);
    }

    document.addEventListener('DOMContentLoaded', () => {
        carregarProdutos();
    });

    // Função para excluir um produto
    async function excluirProduto(idproduto) {
        try {
            const response = await fetch(`/produtos/${idproduto}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                mostrarModal('Produto excluído com sucesso');
                carregarProdutos(); // Recarrega a lista de produtos após a exclusão
            } else {
                mostrarModal('Erro ao excluir produto');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarModal('Erro ao excluir produto');
        }
    }

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