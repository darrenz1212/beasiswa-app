const { User, Mahasiswa } = require('../models');
const bcrypt = require('bcrypt');

const index = async (req, res) => {
    res.render('admin/index', { message: "Admin Site" });
};

const getUser = async (req, res) => {
    try {
        const userList = await User.findAll();
        const result = userList.map(u => ({
            user_id: u.user_id,
            username: u.username,
            password: u.password,
            role: u.role,
            program_studi_id: u.program_studi_id,
            fakultas_id: u.fakultas_id
        }));
        console.log((result))
        res.render('admin/showuser', { user: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOne({ where: { user_id: userID } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            program_studi_id: user.program_studi_id,
            fakultas_id: user.fakultas_id
        };

        res.json({ user: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const data = req.body;
        const hashed_password = bcrypt.hashSync(data.password, 10);

        const newUser = await User.create({
            user_id: data.user_id,
            username: data.username,
            password: hashed_password,
            role: data.role,
            program_studi_id: data.program_studi_id,
            fakultas_id: data.fakultas_id
        });

        res.json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const data = req.body;

        const user = await User.findOne({ where: { user_id: userID } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = data.username || user.username;
        user.password = data.password ? bcrypt.hashSync(data.password, 10) : user.password;
        user.role = data.role || user.role;
        user.program_studi_id = data.program_studi_id || user.program_studi_id;
        user.fakultas_id = data.fakultas_id || user.fakultas_id;

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userID } = req.params;

        const user = await User.findOne({ where: { user_id: userID } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// =========================================================== Mahasiswa ===========================================================
const getMahasiswa = async (req, res) => {
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
        res.render('admin/showmahasiswa', { mahasiswa: result });
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
    getUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getMahasiswa,
    getMahasiswaById,
    addMahasiswa,
    updateMahasiswa,
    deleteMahasiswa
};
