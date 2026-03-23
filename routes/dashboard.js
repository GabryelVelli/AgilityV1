const express = require('express');
const dashboardController = require('../controllers/Dashboard/dashboardController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/dashboard', verifyToken, dashboardController.getDashboard);

module.exports = router;
