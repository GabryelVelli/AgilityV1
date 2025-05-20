  // Verifica se o e-mail existe
  document.getElementById('recuperarForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('recuperarEmail').value;

    const res = await fetch('/verificar-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      // Mostra formulário de nova senha
      document.getElementById('recuperarForm').style.display = 'none';
      document.getElementById('redefinirForm').style.display = 'block';
    } else {
      alert('E-mail não encontrado!');
    }
  });

  // Redefine a senha
  document.getElementById('redefinirForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('recuperarEmail').value;
    const novaSenha = document.getElementById('novaSenha').value;

    const res = await fetch('/redefinir-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, novaSenha })
    });

    if (res.ok) {
      alert('Senha redefinida com sucesso!');
      window.location.href = 'index.html'; // redireciona pro login
    } else {
      alert('Erro ao redefinir a senha.');
    }
  });