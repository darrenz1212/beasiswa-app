const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { requireAuth } = require('../middleware/auth');

// Mahasiswa index
router.get('/', requireAuth, mahasiswaController.index); 

module.exports = router;
