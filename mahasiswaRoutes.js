const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { requireAuth } = require('../middleware/auth');

// Mahasiswa index
router.get('/', requireAuth, mahasiswaController.index);
router.get('/timeline',requireAuth,mahasiswaController.timeline)
router.get('/pengajuan',requireAuth,mahasiswaController.showPendaftaran)
router.get('/history',requireAuth,mahasiswaController.history)

module.exports = router;
