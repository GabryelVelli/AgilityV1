document.getElementById('btnAtualizarSenha').addEventListener('click', async () => {
  const senhaAtual = document.getElementById('senhaAtual').value;
  const novaSenha = document.getElementById('novaSenha').value;
  const token = localStorage.getItem('token');

  if (!senhaAtual || !novaSenha) {
    mostrarModal('Por favor, preencha ambos os campos de senha.');
    return;
  }

  try {
    const response = await fetch('/usuario/alterar-senha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ senhaAtual, novaSenha })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    adicionarNotificacao('Senha Alterada com sucesso!', '/view/Configuracoes/A_Configuracoes.html');
    mostrarModal('Senha atualizada com sucesso!');
    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
  } catch (err) {
    mostrarModal('Erro ao atualizar senha: ' + err.message);
  }
});

