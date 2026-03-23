const pool = require('../../config/db');

async function create(req, res) {
  const { nome, codigoBarras, vencimento, quantidade, fornecedor, categoria } = req.body;

  try {
    const [produtoResult] = await pool.query('SELECT * FROM Produto WHERE codigoBarras = ?', [codigoBarras]);

    if (produtoResult.length > 0) {
      return res.status(400).send('Produto com este código de barras já cadastrado');
    }

    await pool.query(
      `INSERT INTO Produto
        (nome, codigoBarras, vencimento, quantidade, fornecedor, categoria, idusuario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, codigoBarras, vencimento, quantidade, fornecedor, categoria, req.userId]
    );

    return res.status(201).send('Produto adicionado com sucesso');
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err.message);
    return res.status(500).send('Erro ao cadastrar produto');
  }
}

async function list(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Produto WHERE idusuario = ?', [req.userId]);
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return res.status(500).send('Erro ao buscar produtos.');
  }
}

async function remove(req, res) {
  const { idproduto } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM Produto WHERE idproduto = ? AND idusuario = ?',
      [idproduto, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Produto não encontrado ou sem permissão para excluir');
    }

    return res.status(200).send('Produto excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir produto:', error.message);
    return res.status(500).send('Erro ao excluir produto.');
  }
}

async function update(req, res) {
  const { idproduto } = req.params;
  const { nome, codigoBarras, vencimento, quantidade, fornecedor, categoria } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Produto
       SET nome = ?, codigoBarras = ?, vencimento = ?, quantidade = ?, fornecedor = ?, categoria = ?
       WHERE idproduto = ? AND idusuario = ?`,
      [nome, codigoBarras, vencimento, quantidade, fornecedor, categoria, idproduto, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Produto não encontrado ou sem permissão para atualizar');
    }

    return res.status(200).send('Produto atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar produto:', error.message);
    return res.status(500).send('Erro ao atualizar produto.');
  }
}

async function getById(req, res) {
  const { idproduto } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Produto WHERE idproduto = ? AND idusuario = ?',
      [idproduto, req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).send('Produto não encontrado');
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error.message);
    return res.status(500).send('Erro ao buscar produto.');
  }
}

module.exports = { create, list, remove, update, getById };
