const pool = require('../../config/db');

async function create(req, res) {
  const { nome, valor, quantidade, prioridade, categoria } = req.body;

  try {
    await pool.query(
      `INSERT INTO COMPRAS (nome, valor, quantidade, prioridade, categoria, idusuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, valor, quantidade, prioridade, categoria, req.userId]
    );

    return res.status(201).send('Compra adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar compra:', err.message);
    return res.status(500).send('Erro ao adicionar compra');
  }
}

async function list(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM COMPRAS WHERE idusuario = ? ORDER BY IDCompras DESC',
      [req.userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar compras:', err);
    return res.status(500).send('Erro ao buscar compras');
  }
}

async function getById(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM COMPRAS WHERE IDCompras = ? AND idusuario = ?',
      [req.params.id, req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).send('Compra não encontrada');
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar compra:', err.message);
    return res.status(500).send('Erro no servidor');
  }
}

async function update(req, res) {
  const { nome, valor, quantidade, prioridade, categoria } = req.body;
  const id = req.params.id;

  try {
    const [existe] = await pool.query(
      'SELECT * FROM COMPRAS WHERE IDCompras = ? AND idusuario = ?',
      [id, req.userId]
    );

    if (existe.length === 0) {
      return res.status(404).send('Compra não encontrada ou acesso negado');
    }

    await pool.query(
      `UPDATE COMPRAS
       SET nome = ?, valor = ?, quantidade = ?, prioridade = ?, categoria = ?
       WHERE IDCompras = ? AND idusuario = ?`,
      [nome, valor, quantidade, prioridade, categoria, id, req.userId]
    );

    return res.send('Compra atualizada com sucesso');
  } catch (err) {
    console.error('Erro ao editar compra:', err.message);
    return res.status(500).send('Erro ao editar compra');
  }
}

async function remove(req, res) {
  const id = req.params.id;

  try {
    const [result] = await pool.query(
      'SELECT * FROM COMPRAS WHERE IDCompras = ? AND idusuario = ?',
      [id, req.userId]
    );

    if (result.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta compra.');
    }

    await pool.query('DELETE FROM COMPRAS WHERE IDCompras = ?', [id]);
    return res.status(200).send('Compra excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir compra:', err.message);
    return res.status(500).send('Erro ao excluir compra');
  }
}

module.exports = { create, list, getById, update, remove };
