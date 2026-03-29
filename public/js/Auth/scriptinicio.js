function initSidebarInteractions() {
  const menuToggle = document.getElementById('menu-toggle');

  if (menuToggle && !menuToggle.dataset.sidebarBound) {
    menuToggle.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      const mainContent = document.querySelector('.main-content');

      if (!sidebar || !mainContent) {
        return;
      }

      sidebar.classList.toggle('open');
      mainContent.classList.toggle('full-width');
    });

    menuToggle.dataset.sidebarBound = 'true';
  }

  document.querySelectorAll('.submenu-toggle').forEach((button) => {
    if (button.dataset.sidebarBound) {
      return;
    }

    button.addEventListener('click', () => {
      const parent = button.parentElement;
      parent.classList.toggle('open');
    });

    button.dataset.sidebarBound = 'true';
  });
}

function garantirModalGlobal() {
  let modal = document.getElementById('modalExclusao');

  if (modal) {
    return modal;
  }

  modal = document.createElement('div');
  modal.id = 'modalExclusao';
  modal.className = 'modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.zIndex = '9999';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.innerHTML = `
    <div class="modal-content" style="background:#111827;color:#fff;width:min(80%, 420px);margin:15% auto;padding:20px;border:1px solid #888;position:relative;border-radius:10px;">
      <span class="close" style="position:absolute;top:10px;right:15px;font-size:28px;font-weight:bold;cursor:pointer;">&times;</span>
      <p id="mensagemModal"></p>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function mostrarModal(mensagem) {
  const modal = garantirModalGlobal();
  const mensagemModal = modal.querySelector('#mensagemModal');
  const span = modal.querySelector('.close');

  if (!mensagemModal || !span) {
    return;
  }

  mensagemModal.textContent = mensagem;
  modal.style.display = 'block';

  span.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

window.mostrarModal = mostrarModal;

document.addEventListener('DOMContentLoaded', initSidebarInteractions);
document.addEventListener('sidebar:loaded', initSidebarInteractions);
document.addEventListener('topbar:loaded', initSidebarInteractions);

function aplicarTema(tema) {
  document.body.classList.remove('tema-claro', 'tema-escuro');
  document.body.classList.add(`tema-${tema}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const temaSalvo = localStorage.getItem('tema') || 'claro';
  aplicarTema(temaSalvo);

  const selectTema = document.getElementById('tema');
  if (selectTema) {
    selectTema.value = temaSalvo;

    selectTema.addEventListener('change', () => {
      const novoTema = selectTema.value;
      aplicarTema(novoTema);
      localStorage.setItem('tema', novoTema);
    });
  }
});

async function carregarNomeUsuario() {
  const userName = document.querySelector('.user-name');
  const token = localStorage.getItem('token');

  if (!userName) {
    return;
  }

  if (!token) {
    userName.textContent = 'Ol\u00E1, Visitante';
    return;
  }

  try {
    const response = await fetch('/usuario/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('N\u00E3o foi poss\u00EDvel carregar o nome do usu\u00E1rio.');
    }

    const data = await response.json();
    userName.textContent = `Ol\u00E1, ${data.nome}`;
  } catch (error) {
    console.error(error);
    userName.textContent = 'Ol\u00E1, Usu\u00E1rio';
  }
}

document.addEventListener('DOMContentLoaded', carregarNomeUsuario);
document.addEventListener('topbar:loaded', carregarNomeUsuario);

function adicionarAcessoRecente(nome, url, tipo) {
  let acessos = JSON.parse(localStorage.getItem('acessosRecentes')) || [];

  acessos = acessos.filter((acesso) => acesso.url !== url);
  acessos.unshift({ nome, url, tipo, data: new Date().toISOString() });

  if (acessos.length > 5) {
    acessos.pop();
  }

  localStorage.setItem('acessosRecentes', JSON.stringify(acessos));
}

document.addEventListener('DOMContentLoaded', () => {
  const recentesLista = document.querySelector('.recentes-lista');
  const acessosRecentes = JSON.parse(localStorage.getItem('acessosRecentes')) || [];

  if (!recentesLista) {
    return;
  }

  if (acessosRecentes.length === 0) {
    recentesLista.innerHTML = '<p>Nenhum acesso recente.</p>';
    return;
  }

  recentesLista.innerHTML = '';

  const icones = {
    produto: 'fa-box-open',
    estoque: 'fa-warehouse',
    relatorio: 'fa-file-lines',
    fornecedor: 'fa-boxes-stacked',
    compra: 'fa-solid fa-boxes-stacked',
    notafiscal: 'fa-solid fa-warehouse'
  };

  acessosRecentes.forEach((item) => {
    const icone = icones[item.tipo] || 'fa-file';
    const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');

    const divItem = document.createElement('div');
    divItem.classList.add('item-recente');

    divItem.innerHTML = `
      <i class="fa-solid ${icone}"></i>
      <div class="info">
        <a href="${item.url}">${item.nome}</a>
        <span class="data">${dataFormatada}</span>
      </div>
    `;

    recentesLista.appendChild(divItem);
  });
});

function logout() {
  localStorage.removeItem('token');
  mostrarModal('Você foi desconectado.');
  window.location.href = '/view/Auth/login.html';
}
