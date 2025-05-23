const container = document.getElementById('container');
const registerBtn = document.getElementById('registerToggle');
const loginBtn = document.getElementById('loginToggle');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton'); // Adicionando o botão de logout

// Alternar entre formulários de login e registro
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Máscara automática para CPF no input de registro
const cpfInput = document.getElementById('registerCpf');

cpfInput.addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove tudo que não for número
    value = value.replace(/\D/g, '');

    // Aplica a máscara: XXX.XXX.XXX-XX
    if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
        value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
        value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    e.target.value = value;
});

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    // Elimina CPFs inválidos conhecidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Função de cadastro
registerButton.addEventListener('click', async () => {
    const nome = document.getElementById('registerName').value;

    // Remove a máscara para enviar só números
    const cpfMascara = document.getElementById('registerCpf').value;
    const cpf = cpfMascara.replace(/\D/g, '');

    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerPassword').value;

    // Validação do CPF
    if (!validarCPF(cpf)) {
        alert('CPF inválido. Por favor, verifique e tente novamente.');
        return; // Para o envio do formulário
    }

    console.log({ nome, cpf, email, senha }); // Para depuração

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, cpf, email, senha }),
        });

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        console.log(data); // Ver resposta no console

        if (response.ok) {
            alert(data.message || 'Usuário cadastrado com sucesso!'); // Alerta para sucesso
            document.getElementById('registerForm').reset(); // Resetar formulário
            window.location.href = '/view/index.html'; // Redirecionar após cadastro
        } else {
            alert(data.message || 'Erro ao cadastrar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar. Tente novamente.');
    }
});

// Função de login
loginButton.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;

    console.log({ email, senha }); // Para depuração

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data); // Ver dados no console

            // Armazenar token no localStorage
            localStorage.setItem('token', data.token); // Armazena o token no localStorage
            console.log('Token armazenado:', data.token); // Verifique se o token está armazenado corretamente
            
            // Redirecionar após login bem-sucedido
            window.location.href = '/view/A_Home.html'; 
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro no login. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Senha Incorreta. Tente novamente.');
    }
});