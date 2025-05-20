document.addEventListener('DOMContentLoaded', () => {
  const avatarSalvo = localStorage.getItem('avatarSelecionado');

  // Usa o ID correto para o avatar principal
  const avatarPreview = document.getElementById('avatarSelecionado');
  if (avatarSalvo && avatarPreview) {
    avatarPreview.src = `https://i.pravatar.cc/70?img=${avatarSalvo}`; // 70px conforme seu html
  }

  // Avatar global na navbar/menu (se existir)
  const avatarUsuario = document.getElementById('avatarUsuario');
  if (avatarSalvo && avatarUsuario) {
    avatarUsuario.src = `https://i.pravatar.cc/40?img=${avatarSalvo}`;
  }

  // Seleciona todos os avatares com a classe correta ".avatar"
  const avatares = document.querySelectorAll('.avatar');
  avatares.forEach(img => {
    if (img.dataset.id === avatarSalvo) {
      img.classList.add('selecionado');
    }

    img.addEventListener('click', () => {
      selecionarAvatar(img.dataset.id);
      avatares.forEach(i => i.classList.remove('selecionado'));
      img.classList.add('selecionado');
    });
  });
});

function selecionarAvatar(id) {
  localStorage.setItem('avatarSelecionado', id);

  const avatarPreview = document.getElementById('avatarSelecionado');
  if (avatarPreview) {
    avatarPreview.src = `https://i.pravatar.cc/70?img=${id}`;
  }

  const avatarUsuario = document.getElementById('avatarUsuario');
  if (avatarUsuario) {
    avatarUsuario.src = `https://i.pravatar.cc/40?img=${id}`;
  }
}