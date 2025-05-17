// Carregar avatar salvo e dados do usuário (simulado com localStorage)
    document.addEventListener('DOMContentLoaded', () => {
      const avatarSalvo = localStorage.getItem('avatarSelecionado') || 'https://i.pravatar.cc/100?img=1';
      document.getElementById('avatar-preview').src = avatarSalvo;

      const usuarioSalvo = localStorage.getItem('usuario_perfil') || '';
      const emailSalvo = localStorage.getItem('email_perfil') || '';

      document.getElementById('usuario_perfil').value = usuarioSalvo;
      document.getElementById('email_perfil').value = emailSalvo;
    });

    // Selecionar avatar e salvar no localStorage
    document.querySelectorAll('.avatar-option').forEach(img => {
      img.addEventListener('click', () => {
        const avatarUrl = img.getAttribute('data-avatar');
        document.getElementById('avatar-preview').src = avatarUrl;
        localStorage.setItem('avatarSelecionado', avatarUrl);
      });
    });

    // Salvar dados do formulário
    document.getElementById('perfil-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const usuario = document.getElementById('usuario_perfil').value;
      const email = document.getElementById('email_perfil').value;
      const senha = document.getElementById('senha_perfil').value;

      // Aqui você pode enviar os dados para o backend, por enquanto só salva no localStorage:
      localStorage.setItem('usuario_perfil', usuario);
      localStorage.setItem('email_perfil', email);
      // Senha é melhor tratar com cuidado, mas para exemplo simples:
      localStorage.setItem('senha_perfil', senha);

      alert('Perfil atualizado com sucesso!');
    });