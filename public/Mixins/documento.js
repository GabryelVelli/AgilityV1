function removerCaracteresNaoNumericos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function formatarCPF(valor) {
  const digitos = removerCaracteresNaoNumericos(valor).slice(0, 11);

  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return digitos.replace(/(\d{3})(\d+)/, '$1.$2');
  if (digitos.length <= 9) return digitos.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');

  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
}

function formatarCNPJ(valor) {
  const digitos = removerCaracteresNaoNumericos(valor).slice(0, 14);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 5) return digitos.replace(/(\d{2})(\d+)/, '$1.$2');
  if (digitos.length <= 8) return digitos.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
  if (digitos.length <= 12) return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');

  return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
}

function validarCPF(valor) {
  const cpf = removerCaracteresNaoNumericos(valor);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i += 1) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  if (digito !== Number(cpf[9])) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += Number(cpf[i]) * (11 - i);
  }

  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;

  return digito === Number(cpf[10]);
}

function validarCNPJ(valor) {
  const cnpj = removerCaracteresNaoNumericos(valor);

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let tamanho = 12;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i -= 1) {
    soma += Number(numeros[tamanho - i]) * pos;
    pos -= 1;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos[0])) {
    return false;
  }

  tamanho = 13;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i -= 1) {
    soma += Number(numeros[tamanho - i]) * pos;
    pos -= 1;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === Number(digitos[1]);
}

function formatarDocumentoPorTipo(valor, tipo) {
  return tipo === 'cnpj' ? formatarCNPJ(valor) : formatarCPF(valor);
}

function validarDocumentoPorTipo(valor, tipo) {
  return tipo === 'cnpj' ? validarCNPJ(valor) : validarCPF(valor);
}

function comprimentoDocumento(tipo) {
  return tipo === 'cnpj' ? 14 : 11;
}

function criarEstruturaVisualDocumento(input) {
  if (input.parentElement.classList.contains('document-input-wrapper')) {
    return input.parentElement;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'document-input-wrapper';

  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const status = document.createElement('span');
  status.className = 'document-status';
  status.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(status);

  return wrapper;
}

function atualizarStatusDocumento(input) {
  const tipo = input.dataset.docType;
  const wrapper = input.closest('.document-input-wrapper');
  const status = wrapper ? wrapper.querySelector('.document-status') : null;

  if (!tipo || !wrapper || !status) {
    return;
  }

  const digitos = removerCaracteresNaoNumericos(input.value);
  const tamanhoCompleto = comprimentoDocumento(tipo);

  wrapper.classList.remove('is-valid', 'is-invalid');
  status.innerHTML = '';

  if (digitos.length === 0 || digitos.length < tamanhoCompleto) {
    return;
  }

  const valido = validarDocumentoPorTipo(digitos, tipo);
  wrapper.classList.add(valido ? 'is-valid' : 'is-invalid');
  status.innerHTML = valido
    ? '<i class="fa-solid fa-check"></i>'
    : '<i class="fa-solid fa-xmark"></i>';
}

function aplicarMascaraDocumento(input) {
  const tipo = input.dataset.docType;
  input.value = formatarDocumentoPorTipo(input.value, tipo);
  atualizarStatusDocumento(input);
}

function inicializarCampoDocumento(input) {
  if (!input || !input.dataset.docType) {
    return;
  }

  if (input.dataset.docInitialized === 'true') {
    aplicarMascaraDocumento(input);
    return;
  }

  criarEstruturaVisualDocumento(input);
  input.classList.add('document-input');
  input.dataset.docInitialized = 'true';

  input.addEventListener('input', () => {
    aplicarMascaraDocumento(input);
  });

  input.addEventListener('blur', () => {
    atualizarStatusDocumento(input);
  });

  aplicarMascaraDocumento(input);
}

function inicializarValidacaoDocumentos() {
  document.querySelectorAll('[data-doc-type]').forEach((input) => {
    inicializarCampoDocumento(input);
  });
}

window.documentoMixin = {
  removerCaracteresNaoNumericos,
  formatarCPF,
  formatarCNPJ,
  validarCPF,
  validarCNPJ,
  formatarDocumentoPorTipo,
  validarDocumentoPorTipo,
  inicializarValidacaoDocumentos,
  inicializarCampoDocumento
};

document.addEventListener('DOMContentLoaded', inicializarValidacaoDocumentos);
