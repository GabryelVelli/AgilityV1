document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;

    if (!nome || !email || !assunto || !mensagem) {
        mostrarModal('Por favor, preencha todos os campos!');
        return;
    }

    const formData = new FormData(this);
    const urlEncodedData = new URLSearchParams(formData).toString();

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData
    })
    .then(response => response.text())
    .then(result => {
        mostrarModal('E-mail enviado com sucesso!');
    })
    .catch(error => {
        mostrarModal('Erro ao enviar o e-mail.');
    });
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