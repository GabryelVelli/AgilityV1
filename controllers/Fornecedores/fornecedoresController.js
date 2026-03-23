const pool = require('../../config/db');

async function create(req, res) {
  const { nomeEstabelecimento, cnpj, contato, logradouro, numero, bairro, cidade, cep } = req.body;

  try {
    const [estabelecimentoResult] = await pool.query('SELECT * FROM ESTABELECIMENTO WHERE CNPJ = ?', [cnpj]);

    if (estabelecimentoResult.length > 0) {
      return res.status(400).send('Estabelecimento com este CNPJ já cadastrado');
    }

    const [estabelecimentoInsert] = await pool.query(
      'INSERT INTO ESTABELECIMENTO (nome, CNPJ, contato, idusuario) VALUES (?, ?, ?, ?)',
      [nomeEstabelecimento, cnpj, contato, req.userId]
    );

    await pool.query(
      'INSERT INTO Unidade (idestabelecimento, logradouro, numero, bairro, cidade, cep) VALUES (?, ?, ?, ?, ?, ?)',
      [estabelecimentoInsert.insertId, logradouro, numero, bairro, cidade, cep]
    );

    return res.status(201).send('Estabelecimento e unidade cadastrados com sucesso');
  } catch (err) {
    console.error('Erro ao cadastrar estabelecimento e unidade:', err.message);
    return res.status(500).send('Erro ao cadastrar estabelecimento e unidade');
  }
}

async function list(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT
        e.IDestabelecimento,
        e.nome,
        e.CNPJ,
        e.contato,
        u.idunidade,
        u.logradouro,
        u.numero,
        u.bairro,
        u.cidade,
        u.cep
      FROM ESTABELECIMENTO e
      LEFT JOIN Unidade u ON e.IDestabelecimento = u.IDestabelecimento
      WHERE e.idusuario = ?`,
      [req.userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos com unidades:', error.message);
    return res.status(500).send('Erro ao buscar estabelecimentos.');
  }
}

async function update(req, res) {
  const { nomeEstabelecimento, cnpj, contato, logradouro, numero, bairro, cidade, cep } = req.body;
  const idEstabelecimento = req.params.id;

  try {
    const [check] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = ? AND idusuario = ?',
      [idEstabelecimento, req.userId]
    );

    if (check.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    await pool.query(
      'UPDATE ESTABELECIMENTO SET nome = ?, CNPJ = ?, contato = ? WHERE IDestabelecimento = ?',
      [nomeEstabelecimento, cnpj, contato, idEstabelecimento]
    );

    await pool.query(
      'UPDATE Unidade SET logradouro = ?, numero = ?, bairro = ?, cidade = ?, CEP = ? WHERE IDestabelecimento = ?',
      [logradouro, numero, bairro, cidade, cep, idEstabelecimento]
    );

    return res.send('Estabelecimento atualizado com sucesso.');
  } catch (err) {
    console.error('Erro ao atualizar estabelecimento:', err.message);
    return res.status(500).send('Erro ao atualizar estabelecimento.');
  }
}

async function getDetalhes(req, res) {
  const idEstabelecimento = req.params.id;

  try {
    const [check] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = ? AND idusuario = ?',
      [idEstabelecimento, req.userId]
    );

    if (check.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    const [unidadeResult] = await pool.query('SELECT * FROM Unidade WHERE IDestabelecimento = ?', [idEstabelecimento]);

    return res.json({
      estabelecimento: check[0],
      unidade: unidadeResult[0] || {}
    });
  } catch (err) {
    console.error('Erro ao buscar detalhes do estabelecimento:', err.message);
    return res.status(500).send('Erro ao buscar detalhes do estabelecimento.');
  }
}

async function getById(req, res) {
  const id = req.params.id;

  try {
    const [result] = await pool.query(
      `SELECT
        e.IDestabelecimento,
        e.nome,
        e.CNPJ,
        e.contato,
        u.idunidade,
        u.logradouro,
        u.numero,
        u.bairro,
        u.cidade,
        u.cep
      FROM ESTABELECIMENTO e
      LEFT JOIN Unidade u ON e.IDestabelecimento = u.IDestabelecimento
      WHERE e.idusuario = ? AND e.IDestabelecimento = ?`,
      [req.userId, id]
    );

    if (result.length === 0) {
      return res.status(404).send('Estabelecimento não encontrado');
    }

    return res.json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error.message);
    return res.status(500).send('Erro ao buscar estabelecimento.');
  }
}

async function remove(req, res) {
  const idEstabelecimento = req.params.id;

  try {
    const [check] = await pool.query(
      'SELECT * FROM ESTABELECIMENTO WHERE IDestabelecimento = ? AND idusuario = ?',
      [idEstabelecimento, req.userId]
    );

    if (check.length === 0) {
      return res.status(403).send('Estabelecimento não encontrado ou acesso negado.');
    }

    await pool.query('DELETE FROM Unidade WHERE IDestabelecimento = ?', [idEstabelecimento]);
    await pool.query('DELETE FROM ESTABELECIMENTO WHERE IDestabelecimento = ?', [idEstabelecimento]);

    return res.send('Estabelecimento excluído com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir estabelecimento:', err.message);
    return res.status(500).send('Erro ao excluir estabelecimento.');
  }
}

module.exports = { create, list, update, getDetalhes, getById, remove };
