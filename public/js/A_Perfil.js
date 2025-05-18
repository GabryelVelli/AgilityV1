// Aplica o avatar salvo na tela de perfil (se houver)
document.addEventListener('DOMContentLoaded', () => {
  const avatarSalvo = localStorage.getItem('avatarSelecionado');

  // Atualiza o avatar da tela de perfil
  const avatarPreview = document.getElementById('avatarPreview');
  if (avatarSalvo && avatarPreview) {
    avatarPreview.src = `https://i.pravatar.cc/100?img=${avatarSalvo}`;
  }

  // Atualiza o avatar global da navbar/menu (caso exista)
  const avatarUsuario = document.getElementById('avatarUsuario');
  if (avatarSalvo && avatarUsuario) {
    avatarUsuario.src = `https://i.pravatar.cc/40?img=${avatarSalvo}`;
  }

  // Aplica destaque no avatar selecionado
  const avatares = document.querySelectorAll('.avatar-opcao');
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

// Função chamada ao selecionar avatar
function selecionarAvatar(id) {
  localStorage.setItem('avatarSelecionado', id);

  const avatarPreview = document.getElementById('avatarPreview');
  if (avatarPreview) {
    avatarPreview.src = `https://i.pravatar.cc/100?img=${id}`;
  }

  const avatarUsuario = document.getElementById('avatarUsuario');
  if (avatarUsuario) {
    avatarUsuario.src = `https://i.pravatar.cc/40?img=${id}`;
  }
}