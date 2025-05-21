// Abrir/fechar a sidebar
document.getElementById("menu-toggle").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");
  
    sidebar.classList.toggle("open");              // Mostra/oculta sidebar
    mainContent.classList.toggle("full-width");    // Expande ou contrai conteúdo principal
  });
  
  // Expandir/colapsar submenus
  document.querySelectorAll('.submenu-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.parentElement;
      parent.classList.toggle('open'); // Mostra ou esconde os <ul class="submenu">
    });
  });

  // Aplica a classe de tema no body
function aplicarTema(tema) {
  document.body.classList.remove('tema-claro', 'tema-escuro');
  document.body.classList.add(`tema-${tema}`);
  } 

// Ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const temaSalvo = localStorage.getItem('tema') || 'claro'; // tema padrão
  aplicarTema(temaSalvo);

  // Atualiza o <select> com o valor salvo
  const selectTema = document.getElementById('tema');
  if (selectTema) {
      selectTema.value = temaSalvo;

      // Quando o usuário muda o tema
      selectTema.addEventListener('change', () => {
          const novoTema = selectTema.value;
          aplicarTema(novoTema);
          localStorage.setItem('tema', novoTema);
      });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    document.querySelector('.user-name').textContent = 'Olá, Visitante';
    return;
  }

  try {
    const response = await fetch('/usuario/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Não foi possível carregar o nome do usuário.');

    const data = await response.json();
    document.querySelector('.user-name').textContent = `Olá, ${data.nome}`;
  } catch (error) {
    console.error(error);
    document.querySelector('.user-name').textContent = 'Olá, Usuário';
  }
});

//FUNCAO RECENTES//
//FUNCAO RECENTES//
//FUNCAO RECENTES//
//FUNCAO RECENTES//
//FUNCAO RECENTES//


function adicionarAcessoRecente(nome, url, tipo) {
  let acessos = JSON.parse(localStorage.getItem('acessosRecentes')) || [];

  acessos = acessos.filter(acesso => acesso.url !== url);

  acessos.unshift({ nome, url, tipo, data: new Date().toISOString() });

  if (acessos.length > 5) {
    acessos.pop();
  }

  localStorage.setItem('acessosRecentes', JSON.stringify(acessos));
}

// Carrega e exibe os acessos recentes na tela
document.addEventListener('DOMContentLoaded', () => {
  const recentesLista = document.querySelector('.recentes-lista');
  const acessosRecentes = JSON.parse(localStorage.getItem('acessosRecentes')) || [];

  if (acessosRecentes.length === 0) {
    recentesLista.innerHTML = '<p>Nenhum acesso recente.</p>';
    return;
  }

  recentesLista.innerHTML = '';

  const icones = {
    'produto': 'fa-box-open',
    'estoque': 'fa-warehouse',
    'relatorio': 'fa-file-lines',
    'fornecedor': 'fa-boxes-stacked',
    'compra': 'fa-solid fa-boxes-stacked',
    'notafiscal': 'fa-solid fa-warehouse',
  };

  acessosRecentes.forEach(item => {
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
// Função de logout
function logout() {
    // Remover o token do localStorage
    localStorage.removeItem('token'); // Remove o token do localStorage
    alert('Você foi desconectado.'); // Mensagem de confirmação

    // Redirecionar para a página de login
    window.location.href = 'index.html'; // Altere para a página de login
}