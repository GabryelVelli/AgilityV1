async function carregarEstabelecimentos() {
    try {
        const response = await fetch('/estabelecimentos', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'), // Passa o token JWT
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const estabelecimentos = await response.json();

            // Exibe os estabelecimentos em uma tabela
            const estabelecimentosContainer = document.getElementById('estabelecimentosContainer');
            estabelecimentosContainer.innerHTML = ''; // Limpa o container antes de adicionar os novos

            const tabela = document.createElement('table');
            tabela.style = "width: 95%; border-collapse: collapse; color: black; table-layout: fixed;";
            tabela.innerHTML = `
                <thead>
                    <tr style="background-color: #6E6E6E;">
                        <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Nome</th>
                        <th style="border: 1px solid #848484; padding: 8px; text-align: left;">CNPJ</th>
                        <th style="border: 1px solid #848484; padding: 8px; text-align: left;">Contato</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            estabelecimentosContainer.appendChild(tabela);

            const tabelaBody = tabela.querySelector('tbody');
            estabelecimentos.forEach(item => {
                const estabelecimentoRow = document.createElement('tr');
                estabelecimentoRow.innerHTML = `
                    <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${item.nome}</td>
                    <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${item.CNPJ}</td>
                    <td style="border: 1px solid #848484; padding: 8px; word-wrap: break-word; white-space: normal;">${item.contato}</td>
                `;
                tabelaBody.appendChild(estabelecimentoRow);
            });

        } else {
            mostrarModal('Erro ao carregar Estabelecimentos');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarModal('Erro ao carregar Estabelecimentos');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarEstabelecimentos();
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