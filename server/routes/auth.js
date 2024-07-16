const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/', authController.handleLogin);
router.get('/genereate_backend_token', authController.generateBackendToken);

module.exports = router;