// Adiciona uma nova notificação e atualiza o contador
function adicionarNotificacao(titulo, link) {
  const receber = localStorage.getItem('receberNotificacoes');

  // Se a preferência for "false", não adiciona notificações
  if (receber === 'false') return;

  const notificacoes = JSON.parse(localStorage.getItem('notificacoes')) || [];

  notificacoes.unshift({
    titulo,
    link,
    data: new Date().toISOString()
  });

  localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
  atualizarContadorNotificacoes();
}

// Atualiza o número no badge da notificação
function atualizarContadorNotificacoes() {
  const notificacoes = JSON.parse(localStorage.getItem('notificacoes')) || [];
  const badge = document.querySelector('.notification-badge');
  if (!badge) return;

  if (notificacoes.length > 0) {
    badge.textContent = notificacoes.length;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Redireciona para a página de notificações ao clicar no ícone
function configurarCliqueNotificacao() {
  const icon = document.querySelector('.notification-icon');
  if (!icon) return;

  icon.addEventListener('click', () => {
    window.location.href = 'A_Notificacao.html';
  });
}

// Inicializa tudo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorNotificacoes();
  configurarCliqueNotificacao();

  // Garantir que o valor padrão seja true se nunca tiver sido configurado
  if (localStorage.getItem('receberNotificacoes') === null) {
    localStorage.setItem('receberNotificacoes', 'true');
  }
});
 document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('toggleNotificacoes');
    const pref = localStorage.getItem('receberNotificacoes');

    checkbox.checked = pref !== 'false'; // marca por padrão

    checkbox.addEventListener('change', () => {
      localStorage.setItem('receberNotificacoes', checkbox.checked);
    });
  });