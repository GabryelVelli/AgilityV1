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
  
// Função de logout
function logout() {
    // Remover o token do localStorage
    localStorage.removeItem('token'); // Remove o token do localStorage
    alert('Você foi desconectado.'); // Mensagem de confirmação

    // Redirecionar para a página de login
    window.location.href = '/index.html'; // Altere para a página de login
}