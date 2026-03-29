function closeActionMenus() {
  document.querySelectorAll('.action-menu.is-open').forEach((menu) => {
    menu.classList.remove('is-open');

    const trigger = menu.querySelector('.action-menu__trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function toggleActionMenu(button, event) {
  if (event) {
    event.stopPropagation();
  }

  const menu = button.closest('.action-menu');
  const isOpen = menu.classList.contains('is-open');

  closeActionMenus();

  if (!isOpen) {
    menu.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
  }
}

function executarAcaoDoMenu(callback) {
  closeActionMenus();

  if (typeof callback === 'function') {
    callback();
  }
}

function createActionMenu(items) {
  const buttons = items.map((item) => `
    <button
      type="button"
      class="action-menu__item${item.danger ? ' action-menu__item--danger' : ''}"
      onclick="executarAcaoDoMenu(() => ${item.action})"
    >
      ${item.label}
    </button>
  `).join('');

  return `
    <div class="action-menu">
      <button
        type="button"
        class="action-menu__trigger"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Abrir ações"
        onclick="toggleActionMenu(this, event)"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="action-menu__dropdown">
        ${buttons}
      </div>
    </div>
  `;
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.action-menu')) {
    closeActionMenus();
  }
});
