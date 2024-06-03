const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController'); // Pastikan jalur relatif benar

router.get('/', mahasiswaController.index);
router.get('/show-mhsw', mahasiswaController.getMahasiswa);
router.get('/:nrp', mahasiswaController.getMahasiswaById);
router.post('/:userID', mahasiswaController.addMahasiswa);
router.put('/:nrp', mahasiswaController.updateMahasiswa);
router.delete('/:nrp', mahasiswaController.deleteMahasiswa);

module.exports = router;
