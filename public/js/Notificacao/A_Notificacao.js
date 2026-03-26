function adicionarNotificacao(titulo, link) {
  const receber = localStorage.getItem('receberNotificacoes');

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

function configurarCliqueNotificacao() {
  const icon = document.querySelector('.notification-icon');
  if (!icon || icon.dataset.bound === 'true') return;

  icon.addEventListener('click', () => {
    window.location.href = '/view/Notificacao/A_Notificacao.html';
  });

  icon.dataset.bound = 'true';
}

function inicializarNotificacoesTopo() {
  atualizarContadorNotificacoes();
  configurarCliqueNotificacao();

  if (localStorage.getItem('receberNotificacoes') === null) {
    localStorage.setItem('receberNotificacoes', 'true');
  }
}

function inicializarPreferenciaNotificacoes() {
  const checkbox = document.getElementById('toggleNotificacoes');
  if (!checkbox || checkbox.dataset.bound === 'true') return;

  const pref = localStorage.getItem('receberNotificacoes');
  checkbox.checked = pref !== 'false';

  checkbox.addEventListener('change', () => {
    localStorage.setItem('receberNotificacoes', checkbox.checked);
  });

  checkbox.dataset.bound = 'true';
}

document.addEventListener('DOMContentLoaded', inicializarNotificacoesTopo);
document.addEventListener('DOMContentLoaded', inicializarPreferenciaNotificacoes);
document.addEventListener('topbar:loaded', inicializarNotificacoesTopo);
