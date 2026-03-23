const express = require('express');
const fornecedoresController = require('../controllers/Fornecedores/fornecedoresController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/add-estabelecimento', verifyToken, fornecedoresController.create);
router.get('/estabelecimentos', verifyToken, fornecedoresController.list);
router.put('/estabelecimentos/:id', verifyToken, fornecedoresController.update);
router.get('/estabelecimento-detalhes/:id', verifyToken, fornecedoresController.getDetalhes);
router.get('/estabelecimentos/:id', verifyToken, fornecedoresController.getById);
router.delete('/estabelecimentos/:id', verifyToken, fornecedoresController.remove);

module.exports = router;
