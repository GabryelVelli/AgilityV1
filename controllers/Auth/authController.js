const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const pool = require('../../config/db');

async function renderLoginPage(req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'view', 'Auth', 'login.html'));
}

async function register(req, res) {
  const { nome, cpf, email, senha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO USUARIO (nome, cpf, email, senha) VALUES (?, ?, ?, ?)',
      [nome, cpf, email, hashedPassword]
    );

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'Email ou senha inválidos.' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(400).json({ msg: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.IDusuario }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}

async function verificarEmail(req, res) {
  const { email } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'E-mail não encontrado' });
    }

    return res.json({ message: 'E-mail encontrado, prossiga para redefinir a senha' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao consultar o banco' });
  }
}

async function redefinirSenha(req, res) {
  const { email, novaSenha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado com esse e-mail' });
    }

    const hashSenha = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE USUARIO SET senha = ? WHERE email = ?', [hashSenha, email]);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar a senha' });
  }
}

module.exports = {
  renderLoginPage,
  register,
  login,
  verificarEmail,
  redefinirSenha
};
