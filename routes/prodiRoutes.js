const express = require('express');
const router = express.Router();
const path = require('path');
const prodiController = require('../controllers/prodiController');
const { requireAuth } = require('../middleware/auth');

router.get('/',requireAuth,prodiController.index)

router.get('/pengajuan',requireAuth, prodiController.getPengajuanByPeriode);
router.get('/pengajuan/detail/:pengajuan_id',requireAuth, prodiController.getPengajuanDetail);
router.post('/pengajuan/approve/:pengajuan_id',requireAuth, prodiController.approvePengajuan);
router.post('/pengajuan/decline/:pengajuan_id',requireAuth, prodiController.declinePengajuan);

// Download File
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../public/dokumenMahasiswa', filename);

    // Mengirim file kepada pengguna
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

module.exports = router;
