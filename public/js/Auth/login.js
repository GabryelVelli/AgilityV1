const container = document.getElementById('container');
const registerBtn = document.getElementById('registerToggle');
const loginBtn = document.getElementById('loginToggle');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const loginPasswordInput = document.getElementById('loginPassword');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const logoutButton = document.getElementById('logoutButton');

if (toggleLoginPassword && loginPasswordInput) {
    toggleLoginPassword.addEventListener('click', () => {
        const isPasswordHidden = loginPasswordInput.type === 'password';
        loginPasswordInput.type = isPasswordHidden ? 'text' : 'password';
        toggleLoginPassword.innerHTML = isPasswordHidden
            ? '<i class="fa-solid fa-eye-slash"></i>'
            : '<i class="fa-solid fa-eye"></i>';
        toggleLoginPassword.setAttribute(
            'aria-label',
            isPasswordHidden ? 'Ocultar senha' : 'Mostrar senha'
        );
    });
}

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

const cpfInput = document.getElementById('registerCpf');

cpfInput.addEventListener('input', function (e) {
    let value = e.target.value;

    value = value.replace(/\D/g, '');

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

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

registerButton.addEventListener('click', async () => {
    const nome = document.getElementById('registerName').value;
    const cpfMascara = document.getElementById('registerCpf').value;
    const cpf = cpfMascara.replace(/\D/g, '');
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerPassword').value;

    if (!validarCPF(cpf)) {
        alert('CPF invalido. Por favor, verifique e tente novamente.');
        return;
    }

    console.log({ nome, cpf, email, senha });

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

        console.log(data);

        if (response.ok) {
            alert(data.message || 'Usuario cadastrado com sucesso!');
            document.getElementById('registerForm').reset();
            window.location.href = '/view/Auth/login.html';
        } else {
            alert(data.message || 'Erro ao cadastrar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar. Tente novamente.');
    }
});

loginButton.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;

    console.log({ email, senha });

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
            console.log(data);
            localStorage.setItem('token', data.token);
            console.log('Token armazenado:', data.token);
            window.location.href = '/view/Home/A_Home.html';
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro no login. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Senha Incorreta. Tente novamente.');
    }
});
