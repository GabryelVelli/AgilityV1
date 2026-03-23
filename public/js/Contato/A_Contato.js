const form = document.getElementById('contact-form');
const nextInput = form.querySelector('input[name="_next"]');

if (nextInput) {
    nextInput.value = `${window.location.origin}/view/Contato/A_Contato.html?enviado=1`;
}

form.addEventListener('submit', function (e) {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const assunto = document.getElementById('assunto').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !assunto || !mensagem) {
        e.preventDefault();
        mostrarModal('Por favor, preencha todos os campos!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('enviado') === '1') {
        mostrarModal('E-mail enviado com sucesso!');
        window.history.replaceState({}, document.title, window.location.pathname);
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
