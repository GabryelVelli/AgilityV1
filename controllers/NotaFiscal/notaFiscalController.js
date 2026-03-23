const pool = require('../../config/db');

async function create(req, res) {
  const { Numero, Serie, data_emissao, Valor_total, Fornecedor } = req.body;

  try {
    await pool.query(
      `INSERT INTO NOTA_FISCAL
       (Numero, Serie, data_emissao, Valor_total, Fornecedor, idusuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Numero, Serie, data_emissao, Valor_total, Fornecedor, req.userId]
    );

    return res.status(201).send('Nota fiscal adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar nota fiscal:', err.message);
    return res.status(500).send('Erro ao adicionar nota fiscal');
  }
}

async function list(req, res) {
  try {
    const [notas] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE idusuario = ? ORDER BY criado_em DESC',
      [req.userId]
    );

    return res.json(notas);
  } catch (err) {
    console.error('Erro ao listar notas fiscais:', err.message);
    return res.status(500).send('Erro ao buscar notas fiscais');
  }
}

async function getById(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [req.params.id, req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).send('Nota não encontrada');
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar nota:', err.message);
    return res.status(500).send('Erro no servidor');
  }
}

async function update(req, res) {
  const { Numero, Serie, data_emissao, Valor_total, Fornecedor } = req.body;
  const id = req.params.id;

  try {
    const [existe] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, req.userId]
    );

    if (existe.length === 0) {
      return res.status(404).send('Nota não encontrada ou acesso negado');
    }

    await pool.query(
      `UPDATE NOTA_FISCAL
       SET Numero = ?, Serie = ?, data_emissao = ?, Valor_total = ?, Fornecedor = ?
       WHERE IDnota = ? AND idusuario = ?`,
      [Numero, Serie, data_emissao, Valor_total, Fornecedor, id, req.userId]
    );

    return res.send('Nota fiscal atualizada com sucesso');
  } catch (err) {
    console.error('Erro ao editar nota:', err.message);
    return res.status(500).send('Erro ao editar nota fiscal');
  }
}

async function remove(req, res) {
  const id = req.params.id;

  try {
    const [result] = await pool.query(
      'SELECT * FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, req.userId]
    );

    if (result.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta nota.');
    }

    await pool.query(
      'DELETE FROM NOTA_FISCAL WHERE IDnota = ? AND idusuario = ?',
      [id, req.userId]
    );

    return res.status(200).send('Nota excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir nota fiscal:', err.message);
    return res.status(500).send('Erro ao excluir nota fiscal');
  }
}

module.exports = { create, list, getById, update, remove };
