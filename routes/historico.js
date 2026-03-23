const express = require('express');
const historicoController = require('../controllers/Historico/historicoController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/estoque/movimentar', verifyToken, historicoController.registrarMovimentacao);
router.get('/estoque/historico', verifyToken, historicoController.listarHistorico);
router.delete('/estoque/historico/:idmovimentacao', verifyToken, historicoController.excluirMovimentacao);

module.exports = router;
