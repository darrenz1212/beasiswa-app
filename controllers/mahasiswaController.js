const { Mahasiswa, User } = require('../models');


const index = async (req,res) =>{
    res.render('mahasiswa/index',{ message: "Mahasiswa Site"})
}
const getMahasiswa = async (req, res) => {
    try {
        const mahasiswaList = await Mahasiswa.findAll();
        const result = mahasiswaList.map(m => ({
            nrp: m.nrp,
            user_id: m.user_id,
            nama_mahasiswa: m.nama_mahasiswa,
            prodi: m.program_studi_id,
            ipk: m.ipk_terakhir,
            status: m.status_aktif
        }));
        res.render('mahasiswa/showmahasiswa', { mahasiswa: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMahasiswaById = async (req, res) => {
    try {
        const { nrp } = req.params;
        const mahasiswa = await Mahasiswa.findOne({ where: { nrp } });

        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa not found' });
        }

        const result = {
            nrp: mahasiswa.nrp,
            user_id: mahasiswa.user_id,
            nama_mahasiswa: mahasiswa.nama_mahasiswa,
            prodi: mahasiswa.program_studi_id,
            ipk: mahasiswa.ipk_terakhir,
            status: mahasiswa.status_aktif
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addMahasiswa = async (req, res) => {
    try {
        const { userID } = req.params;
        const data = req.body;

        const user_info = await User.findOne({ where: { user_id: userID } });

        if (!user_info) {
            return res.status(404).json({ message: 'User not found' });
        }

        const new_mahasiswa = await Mahasiswa.create({
            nrp: data.nrp,
            user_id: userID,
            nama_mahasiswa: user_info.username,
            program_studi_id: user_info.program_studi_id,
            ipk_terakhir: data.ipk,
            status_aktif: data.status
        });

        res.json({
            message: 'Mahasiswa added successfully',
            nrp: new_mahasiswa.nrp,
            nama_mahasiswa: new_mahasiswa.nama_mahasiswa,
            program_studi_id: user_info.program_studi_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMahasiswa = async (req, res) => {
    try {
        const { nrp } = req.params;
        const data = req.body;

        const mahasiswa = await Mahasiswa.findOne({ where: { nrp } });

        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa not found' });
        }

        mahasiswa.nama_mahasiswa = data.nama_mahasiswa || mahasiswa.nama_mahasiswa;
        mahasiswa.program_studi_id = data.program_studi_id || mahasiswa.program_studi_id;
        mahasiswa.ipk_terakhir = data.ipk || mahasiswa.ipk_terakhir;
        mahasiswa.status_aktif = data.status || mahasiswa.status_aktif;

        await mahasiswa.save();
        res.json({ message: 'Mahasiswa updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMahasiswa = async (req, res) => {
    try {
        const { nrp } = req.params;

        const mahasiswa = await Mahasiswa.findOne({ where: { nrp } });

        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa not found' });
        }

        await mahasiswa.destroy();
        res.json({ message: 'Mahasiswa deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    index,
    getMahasiswa,
    getMahasiswaById,
    addMahasiswa,
    updateMahasiswa,
    deleteMahasiswa
};
