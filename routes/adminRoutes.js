const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');

// Admin index
router.get('/', requireAuth, adminController.index);

// User routes
router.get('/users', requireAuth, adminController.getUser);
router.get('/users/:userID', requireAuth, adminController.getUserById);
router.post('/users', requireAuth, adminController.addUser);
router.put('/users/update/:userID', requireAuth, adminController.updateUser);
router.delete('/users/delete/:userID', requireAuth, adminController.deleteUser);

// Mahasiswa routes
router.get('/mahasiswa', requireAuth, adminController.getMahasiswa);
router.get('/mahasiswa/:nrp', requireAuth, adminController.getMahasiswaById);
router.post('/mahasiswa', requireAuth, adminController.addMahasiswa);
router.put('/mahasiswa/:nrp', requireAuth, adminController.updateMahasiswa);
router.delete('/mahasiswa/:nrp', requireAuth, adminController.deleteMahasiswa);

router.post('/fakultas', requireAuth, adminController.addFakultas);
router.post('/program_studi', requireAuth, adminController.addProgramStudi);

module.exports = router;