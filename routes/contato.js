const express = require('express');
const contatoController = require('../controllers/Contato/contatoController');

const router = express.Router();

router.post('/send-email', contatoController.sendEmail);

module.exports = router;
