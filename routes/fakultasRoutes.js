const express = require('express');
const fakultasController = require('../controllers/fakultasController');
const { requireAuth } = require('../middleware/auth');
const prodiController = require("../controllers/prodiController");
const path = require("path"); // Pastikan middleware ini sesuai dengan kebutuhan

const router = express.Router();
router.get('/', requireAuth, fakultasController.index);
router.get('/pengajuan', requireAuth, fakultasController.getAllPengajuan);
router.get('/pengajuan/disetujui-prodi', requireAuth, fakultasController.getApprovedByProdiPengajuan);
router.get('/pengajuan/detail/:pengajuan_id',requireAuth, prodiController.getPengajuanDetail);
router.post('/pengajuan/approve/:pengajuan_id', requireAuth, fakultasController.approvePengajuan);
router.post('/pengajuan/decline/:pengajuan_id', requireAuth, fakultasController.declinePengajuan);
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../public/dokumenMahasiswa', filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

module.exports = router;
