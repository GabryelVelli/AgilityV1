document.getElementById('btnAtualizarSenha').addEventListener('click', async () => {
  const senhaAtual = document.getElementById('senhaAtual').value;
  const novaSenha = document.getElementById('novaSenha').value;
  const token = localStorage.getItem('token');

  if (!senhaAtual || !novaSenha) {
    alert('Por favor, preencha ambos os campos de senha.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/usuario/alterar-senha', {
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

    mostrarModal('Senha atualizada com sucesso!');
    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
  } catch (err) {
    mostrarModal('Erro ao atualizar senha: ' + err.message);
  }
});

function mostrarModal(mensagem) {
  const modal = document.getElementById('modalExclusao');
  const mensagemModal = document.getElementById('mensagemModal');

  mensagemModal.textContent = mensagem;
  modal.style.display = 'flex'; // Usa flex para centralizar

  // Fecha modal se clicar fora da caixa de mensagem
  modal.onclick = (event) => {
    // só fecha se clicar na área do modal, não na mensagem
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
}