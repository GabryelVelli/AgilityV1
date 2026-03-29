function garantirModalGlobal() {
  let modal = document.getElementById('modalExclusao');

  if (modal) {
    return modal;
  }

  modal = document.createElement('div');
  modal.id = 'modalExclusao';
  modal.className = 'modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.zIndex = '9999';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.innerHTML = `
    <div class="modal-content" style="background:#111827;color:#fff;width:min(80%, 420px);margin:15% auto;padding:20px;border:1px solid #888;position:relative;border-radius:10px;">
      <span class="close" style="position:absolute;top:10px;right:15px;font-size:28px;font-weight:bold;cursor:pointer;">&times;</span>
      <p id="mensagemModal"></p>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function mostrarModal(mensagem) {
  const modal = garantirModalGlobal();
  const mensagemModal = modal.querySelector('#mensagemModal');
  const span = modal.querySelector('.close');

  if (!mensagemModal || !span) {
    return;
  }

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

window.mostrarModal = mostrarModal;
