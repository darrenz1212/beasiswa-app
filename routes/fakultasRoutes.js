const express = require('express');
const fakultasController = require('../controllers/fakultasController');
const { requireAuth } = require('../middleware/auth');
const prodiController = require("../controllers/prodiController"); // Pastikan middleware ini sesuai dengan kebutuhan

const router = express.Router();
router.get('/', requireAuth, fakultasController.index);
router.get('/pengajuan', requireAuth, fakultasController.getAllPengajuan);
router.get('/pengajuan/disetujui-prodi', requireAuth, fakultasController.getApprovedByProdiPengajuan);
router.get('/pengajuan/detail/:pengajuan_id',requireAuth, prodiController.getPengajuanDetail);
router.post('/pengajuan/approve/:pengajuan_id', requireAuth, fakultasController.approvePengajuan);
router.post('/pengajuan/decline/:pengajuan_id', requireAuth, fakultasController.declinePengajuan);

module.exports = router;
