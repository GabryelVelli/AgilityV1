
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send-btn');

  function addMessage(text, sender) {
    const p = document.createElement('div');
    p.classList.add('message', sender);
    p.textContent = text;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
  }

  function botResponse(msg) {
    const msgLower = msg.toLowerCase();

    if (msgLower.includes('cadastro') && msgLower.includes('produto')) {
      addMessage('Para cadastrar um produto, vá até a seção "Cadastrar Produto" no menu lateral.', 'bot');
    } else if (msgLower.includes('nota fiscal')) {
      addMessage('Você pode cadastrar uma nota fiscal na aba "Notas Fiscais".', 'bot');
    } else if (msgLower.includes('compra')) {
      addMessage('Para registrar compras, acesse a área "Cadastro de Compras".', 'bot');
    } else if (msgLower.includes('fornecedor')) {
      addMessage('Na seção "Fornecedores" você pode adicionar novos fornecedores.', 'bot');
    } else if (msgLower.includes('suporte')) {
      addMessage('Para suporte, envie um e-mail para suporte@seusite.com.', 'bot');
    } else if (msgLower.includes('editar') && msgLower.includes('produto')) {
      addMessage('Para editar um produto, acesse a lista de produtos e clique no botão "Editar".', 'bot');
    } else if (msgLower.includes('excluir') && msgLower.includes('compra')) {
      addMessage('Na lista de compras, clique em "Excluir" para remover um registro.', 'bot');
    } else if (msgLower.includes('relatório')) {
      addMessage('Você pode gerar relatórios acessando a seção "Relatórios".', 'bot');
    } else if (msgLower.includes('categoria')) {
      addMessage('Você pode visualizar e gerenciar categorias na seção "Categorias".', 'bot');
    } else if (msgLower.includes('prioridade')) {
      addMessage('A prioridade ajuda a organizar as compras mais urgentes no topo da lista.', 'bot');
    } else if (
      msgLower.includes('olá') ||
      msgLower.includes('ola') ||
      msgLower.includes('oi')
    ) {
      addMessage('Olá! Como posso ajudar no gerenciamento de estoque?', 'bot');
    } else {
      addMessage('Desculpe, não entendi. Pode reformular?', 'bot');
    }
  }

  function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';
    botResponse(msg);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });