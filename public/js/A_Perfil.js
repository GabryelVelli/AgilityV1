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
 document.getElementById('alterarEmailForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailAtual = document.getElementById('emailAtual').value;
    const novoEmail = document.getElementById('novoEmail').value;

    try {
      const res = await fetch('/usuario/alterar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token') // Token do login
        },
        body: JSON.stringify({ emailAtual, novoEmail })
      });

      if (res.ok) {
        mostrarModal('E-mail alterado com sucesso!');
        // Redirecionar ou limpar campos, se quiser
      } else {
        const erro = await res.text();
        mostrarModal('Erro: ' + erro);
      }
    } catch (err) {
      console.error(err);
      mostrarModal('Erro ao conectar com o servidor');
    }
  });
     function mostrarModal(mensagem) {
      const modal = document.getElementById('modalExclusao');
      const mensagemModal = document.getElementById('mensagemModal');
      const span = document.getElementsByClassName('close')[0];

      mensagemModal.textContent = mensagem;
      modal.style.display = 'block';

      span.onclick = function () {
          modal.style.display = 'none';
      }

      window.onclick = function (event) {
          if (event.target == modal) {
              modal.style.display = 'none';
          }
      }
    }