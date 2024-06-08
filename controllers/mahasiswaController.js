// controllers/mahasiswaController.js
const { Mahasiswa } = require('../models');

const index = async (req, res) => {
    try {
        const mahasiswaList = await Mahasiswa.findAll();
        const result = mahasiswaList.map(m => ({
            nrp: m.nrp,
            user_id: m.user_id,
            nama_mahasiswa: m.nama_mahasiswa,
            prodi: m.program_studi_id,
            ipk: m.ipk_terakhir,
            status: m.status_aktif ? 'Aktif' : 'Tidak Aktif'
        }));
        res.render('mahasiswa/dashboard', { mahasiswa: result }); // gatau ini ke dashboard atau ke mahasiswa
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    index,
};
