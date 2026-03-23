const express = require('express');
const authController = require('../controllers/Auth/authController');

const router = express.Router();

router.get('/', authController.renderLoginPage);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verificar-email', authController.verificarEmail);
router.post('/redefinir-senha', authController.redefinirSenha);

module.exports = router;
