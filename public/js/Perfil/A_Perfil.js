document.addEventListener('DOMContentLoaded', () => {
  const avatarMap = {
    1: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
    2: 'https://i.pinimg.com/564x/5b/50/e7/5b50e75d07c726d36f397f6359098f58.jpg',
    3: 'https://wallpapers.com/images/hd/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg',
    4: 'https://loodibee.com/wp-content/uploads/Netflix-avatar-7.png'
  };

  const avatarSalvoId = localStorage.getItem('avatarSelecionado');
  const avatarUrl = avatarMap[avatarSalvoId];

  const avatarPreview = document.getElementById('avatarSelecionado');
  if (avatarSalvoId && avatarPreview && avatarUrl) {
    avatarPreview.src = avatarUrl;
  }

  const avatarUsuario = document.getElementById('avatarUsuario');
  if (avatarSalvoId && avatarUsuario && avatarUrl) {
    avatarUsuario.src = avatarUrl;
  }

  const avatares = document.querySelectorAll('.avatar');
  avatares.forEach(img => {
    if (img.dataset.id === avatarSalvoId) {
      img.classList.add('selecionado');
    }

    img.addEventListener('click', () => {
      const id = img.dataset.id;
      selecionarAvatar(id);
      avatares.forEach(i => i.classList.remove('selecionado'));
      img.classList.add('selecionado');
    });
  });
});

function selecionarAvatar(id) {
  const avatarMap = {
    1: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
    2: 'https://i.pinimg.com/564x/5b/50/e7/5b50e75d07c726d36f397f6359098f58.jpg',
    3: 'https://wallpapers.com/images/hd/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg',
    4: 'https://loodibee.com/wp-content/uploads/Netflix-avatar-7.png'
  };

  const url = avatarMap[id];
  if (!url) return;

  localStorage.setItem('avatarSelecionado', id);

  const avatarPreview = document.getElementById('avatarSelecionado');
  if (avatarPreview) {
    avatarPreview.src = url;
  }

  const avatarUsuario = document.getElementById('avatarUsuario');
  if (avatarUsuario) {
    avatarUsuario.src = url;
  }
}

// Lógica para o formulário de alteração de e-mail
document.getElementById('alterarEmailForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailAtual = document.getElementById('emailAtual').value;
  const novoEmail = document.getElementById('novoEmail').value;

  try {
    const res = await fetch('/usuario/alterar-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ emailAtual, novoEmail })
    });

    if (res.ok) {
      mostrarModal('E-mail alterado com sucesso!');
    } else {
      const erro = await res.text();
      mostrarModal('Erro: ' + erro);
    }
  } catch (err) {
    console.error(err);
    mostrarModal('Erro ao conectar com o servidor');
  }
});

// Função para exibir modal de mensagens
function mostrarModal(mensagem) {
  const modal = document.getElementById('modalExclusao');
  const mensagemModal = document.getElementById('mensagemModal');
  const span = document.getElementsByClassName('close')[0];

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
