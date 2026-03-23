const express = require('express');
const usuarioController = require('../controllers/Usuario/usuarioController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/usuario/me', verifyToken, usuarioController.getCurrentUser);
router.post('/usuario/alterar-senha', verifyToken, usuarioController.alterarSenha);
router.post('/usuario/alterar-email', verifyToken, usuarioController.alterarEmail);

module.exports = router;
