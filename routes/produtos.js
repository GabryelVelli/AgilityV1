const express = require('express');
const produtosController = require('../controllers/Produtos/produtosController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/add-produto', verifyToken, produtosController.create);
router.get('/produtos', verifyToken, produtosController.list);
router.delete('/produtos/:idproduto', verifyToken, produtosController.remove);
router.put('/produtos/:idproduto', verifyToken, produtosController.update);
router.get('/produtos/:idproduto', verifyToken, produtosController.getById);

module.exports = router;
