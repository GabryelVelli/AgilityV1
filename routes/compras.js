const express = require('express');
const comprasController = require('../controllers/Compras/comprasController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/compras/adicionar', verifyToken, comprasController.create);
router.get('/compras/listar', verifyToken, comprasController.list);
router.get('/compras/:id', verifyToken, comprasController.getById);
router.put('/compras/editar/:id', verifyToken, comprasController.update);
router.delete('/compras/excluir/:id', verifyToken, comprasController.remove);

module.exports = router;
