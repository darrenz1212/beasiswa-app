const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/login');
const registerController = require('../controllers/auth/register');

router.get('/login', loginController.index);
router.post('/login', loginController.login);
router.get('/register', registerController.index);
router.post('/register', registerController.register);
router.post('/logout', loginController.logout);

module.exports = router;
