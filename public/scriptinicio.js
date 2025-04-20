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

// Função de logout
function logout() {
    // Remover o token do localStorage
    localStorage.removeItem('token'); // Remove o token do localStorage
    alert('Você foi desconectado.'); // Mensagem de confirmação

    // Redirecionar para a página de login
    window.location.href = '/index.html'; // Altere para a página de login
}