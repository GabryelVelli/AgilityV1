const container = document.getElementById('container');
const registerBtn = document.getElementById('registerToggle');
const loginBtn = document.getElementById('loginToggle');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const loginPasswordInput = document.getElementById('loginPassword');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');

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

registerButton.addEventListener('click', async () => {
    const nome = document.getElementById('registerName').value;
    const cpfMascara = document.getElementById('registerCpf').value;
    const cpf = documentoMixin.removerCaracteresNaoNumericos(cpfMascara);
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerPassword').value;

    if (!documentoMixin.validarCPF(cpf)) {
        cpfInput.focus();
        mostrarModal('CPF inválido. Por favor, verifique e tente novamente.');
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
            mostrarModal(data.message || 'Usuario cadastrado com sucesso!');
            document.getElementById('registerForm').reset();
            window.location.href = '/view/Auth/login.html';
        } else {
            mostrarModal(data.message || 'Erro ao cadastrar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarModal('Erro ao cadastrar. Tente novamente.');
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
            mostrarModal(errorData.message || 'Erro no login. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarModal('Senha Incorreta. Tente novamente.');
    }
});
