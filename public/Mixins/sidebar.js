const sidebarPageAliases = {
  'A_Dashboard.html': 'A_Home.html',
  'A_Notificacao.html': 'A_Home.html',
  'A_DetalhesProduto.html': 'A_Estoque.html',
  'A_EditarProduto.html': 'A_Estoque.html',
  'A_DashboardFornecedor.html': 'A_Fornecedores.html',
  'A_DetalhesFornecedores.html': 'A_Fornecedores.html',
  'A_EditarFornecedor.html': 'A_Fornecedores.html',
  'A_DetalhesCompra.html': 'A_Compras.html',
  'A_EditarCompra.html': 'A_Compras.html',
  'A_DetalhesNotaFiscal.html': 'A_NotaFiscal.html',
  'A_EditarNotaFiscal.html': 'A_NotaFiscal.html',
  'A_Privacidade.html': 'A_Configuracoes.html'
};

function highlightCurrentSidebarItem(sidebarRoot) {
  const currentPage = window.location.pathname.split('/').pop();
  const targetPage = sidebarPageAliases[currentPage] || currentPage;
  const links = sidebarRoot.querySelectorAll('a[href]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      return;
    }

    const linkPage = href.split('/').pop().split('?')[0];

    if (linkPage === targetPage) {
      link.classList.add('active');
      const submenuItem = link.closest('.has-submenu');
      if (submenuItem) {
        submenuItem.classList.add('open');
        const toggle = submenuItem.querySelector('.submenu-toggle');
        if (toggle) {
          toggle.classList.add('active');
        }
      }
    }
  });
}

async function loadSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) {
    return;
  }

  try {
    const response = await fetch('/components/sidebar.html', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Falha ao carregar sidebar: ${response.status}`);
    }

    const sidebarMarkup = await response.text();
    container.outerHTML = sidebarMarkup;
    const sidebarRoot = document.getElementById('sidebar');

    if (sidebarRoot) {
      highlightCurrentSidebarItem(sidebarRoot);
      document.dispatchEvent(new CustomEvent('sidebar:loaded'));
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', loadSidebar);
