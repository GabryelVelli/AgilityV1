const pool = require('../../config/db');

async function getDashboard(req, res) {
  try {
    const idusuario = req.userId;

    const [totalProdutos] = await pool.query('SELECT COUNT(*) AS total FROM Produto WHERE idusuario = ?', [idusuario]);
    const [produtosVencidos] = await pool.query(
      'SELECT COUNT(*) AS total FROM Produto WHERE idusuario = ? AND vencimento < CURDATE()',
      [idusuario]
    );
    const [proximosVencimento] = await pool.query(
      `SELECT COUNT(*) AS total FROM Produto
       WHERE idusuario = ?
       AND vencimento >= CURDATE()
       AND vencimento <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
      [idusuario]
    );
    const [produtosSeguros] = await pool.query(
      `SELECT COUNT(*) AS total FROM Produto
       WHERE idusuario = ?
       AND vencimento > DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
      [idusuario]
    );

    return res.json({
      totalProdutos: totalProdutos[0].total,
      produtosVencidos: produtosVencidos[0].total,
      proximosVencimento: proximosVencimento[0].total,
      produtosSeguros: produtosSeguros[0].total
    });
  } catch (error) {
    console.error('Erro ao buscar dados da dashboard:', error.message);
    return res.status(500).send('Erro ao buscar dados da dashboard.');
  }
}

module.exports = { getDashboard };
