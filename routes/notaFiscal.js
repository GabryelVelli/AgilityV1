const express = require('express');
const notaFiscalController = require('../controllers/NotaFiscal/notaFiscalController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/nota/adicionar', verifyToken, notaFiscalController.create);
router.get('/nota/listar', verifyToken, notaFiscalController.list);
router.get('/nota/:id', verifyToken, notaFiscalController.getById);
router.put('/nota/editar/:id', verifyToken, notaFiscalController.update);
router.delete('/nota/excluir/:id', verifyToken, notaFiscalController.remove);

module.exports = router;
