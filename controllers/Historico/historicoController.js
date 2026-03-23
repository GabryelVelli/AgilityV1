const pool = require('../../config/db');

async function registrarMovimentacao(req, res) {
  const { idproduto, tipo, quantidade, observacao } = req.body;

  if (!idproduto || !tipo || !quantidade) {
    return res.status(400).send('Campos obrigatórios: idproduto, tipo e quantidade.');
  }

  try {
    const [produto] = await pool.query('SELECT quantidade FROM Produto WHERE idproduto = ?', [idproduto]);

    if (produto.length === 0) {
      return res.status(404).send('Produto não encontrado.');
    }

    let novaQuantidade = produto[0].quantidade;

    if (tipo === 'entrada') {
      novaQuantidade += quantidade;
    } else if (tipo === 'saida') {
      if (quantidade > novaQuantidade) {
        return res.status(400).send('Quantidade de saída maior que o estoque atual.');
      }
      novaQuantidade -= quantidade;
    } else {
      return res.status(400).send('Tipo de movimentação inválido.');
    }

    await pool.query('UPDATE Produto SET quantidade = ? WHERE idproduto = ?', [novaQuantidade, idproduto]);
    await pool.query(
      'INSERT INTO MovimentacaoEstoque (idproduto, idusuario, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)',
      [idproduto, req.userId, tipo, quantidade, observacao || null]
    );

    return res.send('Movimentação registrada com sucesso!');
  } catch (err) {
    console.error('Erro na movimentação:', err);
    return res.status(500).send('Erro no servidor ao registrar movimentação.');
  }
}

async function listarHistorico(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT m.idmovimentacao, m.tipo, m.quantidade, m.dataMovimentacao, m.observacao,
              p.nome AS nome
       FROM MovimentacaoEstoque m
       JOIN Produto p ON m.idproduto = p.idproduto
       WHERE p.idusuario = ?
       ORDER BY m.dataMovimentacao DESC`,
      [req.userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    return res.status(500).send('Erro ao buscar histórico');
  }
}

async function excluirMovimentacao(req, res) {
  const idmovimentacao = req.params.idmovimentacao;

  try {
    const [result] = await pool.query(
      'SELECT * FROM MovimentacaoEstoque WHERE idmovimentacao = ? AND idusuario = ?',
      [idmovimentacao, req.userId]
    );

    if (result.length === 0) {
      return res.status(403).send('Você não tem permissão para excluir esta movimentação.');
    }

    await pool.query('DELETE FROM MovimentacaoEstoque WHERE idmovimentacao = ?', [idmovimentacao]);
    return res.status(200).send('Movimentação excluída com sucesso.');
  } catch (err) {
    console.error('Erro ao excluir movimentação:', err);
    return res.status(500).send('Erro ao excluir movimentação');
  }
}

module.exports = { registrarMovimentacao, listarHistorico, excluirMovimentacao };
