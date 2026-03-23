document.addEventListener('DOMContentLoaded', () => {
    carregarDashboard();
});

async function carregarDashboard() {
    try {
        const response = await fetch('/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const dados = await response.json();
            document.getElementById('totalProdutos').textContent = dados.totalProdutos;
            document.getElementById('produtosVencidos').textContent = dados.produtosVencidos;
            document.getElementById('proximosVencimento').textContent = dados.proximosVencimento;
            document.getElementById('produtosSeguros').textContent = dados.produtosSeguros;
        } else {
            console.error('Erro ao carregar dados da dashboard');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}