
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