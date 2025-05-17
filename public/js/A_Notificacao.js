// Adiciona uma nova notificação e atualiza o contador
function adicionarNotificacao(titulo, link) {
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
  if (!badge) return; // evita erro se não encontrar o elemento

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
    window.location.href = 'A_Notificacao.html'; // caminho para a sua página de notificações
  });
}

// Inicializa tudo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorNotificacoes();
  configurarCliqueNotificacao();
});