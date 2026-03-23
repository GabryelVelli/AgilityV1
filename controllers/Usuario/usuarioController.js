const bcrypt = require('bcryptjs');
const pool = require('../../config/db');

async function getCurrentUser(req, res) {
  try {
    const [rows] = await pool.query('SELECT nome FROM USUARIO WHERE IDusuario = ?', [req.userId]);

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    return res.json({ nome: rows[0].nome });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message);
    return res.status(500).send('Erro no servidor');
  }
}

async function alterarSenha(req, res) {
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).send('Campos senhaAtual e novaSenha são obrigatórios.');
  }

  try {
    const [rows] = await pool.query('SELECT senha FROM USUARIO WHERE IDusuario = ?', [req.userId]);

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const senhaConfere = await bcrypt.compare(senhaAtual, rows[0].senha);

    if (!senhaConfere) {
      return res.status(401).send('Senha atual incorreta');
    }

    const hashNovaSenha = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE USUARIO SET senha = ? WHERE IDusuario = ?', [hashNovaSenha, req.userId]);

    return res.send('Senha atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    return res.status(500).send('Erro no servidor');
  }
}

async function alterarEmail(req, res) {
  const { emailAtual, novoEmail } = req.body;

  if (!emailAtual || !novoEmail) {
    return res.status(400).send('Campos emailAtual e novoEmail são obrigatórios.');
  }

  try {
    const [rows] = await pool.query('SELECT email FROM USUARIO WHERE IDusuario = ?', [req.userId]);

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    if (emailAtual !== rows[0].email) {
      return res.status(401).send('E-mail atual incorreto');
    }

    await pool.query('UPDATE USUARIO SET email = ? WHERE IDusuario = ?', [novoEmail, req.userId]);
    return res.send('E-mail atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar e-mail:', err);
    return res.status(500).send('Erro no servidor');
  }
}

module.exports = {
  getCurrentUser,
  alterarSenha,
  alterarEmail
};
