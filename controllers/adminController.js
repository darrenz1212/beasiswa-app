const { User, Mahasiswa } = require('../models');
const { Fakultas, ProgramStudi } = require('../models');
const bcrypt = require('bcrypt');

// Admin index
const index = async (req, res) => {
    try {
        const fakultasList = await Fakultas.findAll();
        const programStudiList = await ProgramStudi.findAll();
        
        res.render('admin/index', { fakultas: fakultasList, programStudi: programStudiList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
const getUser = async (req, res) => {
    try {
        const userList = await User.findAll();
        const result = userList.map(u => ({
            user_id: u.user_id,
            username: u.username,
            role: u.role,
            program_studi_id: u.program_studi_id,
            fakultas_id: u.fakultas_id
        }));
        res.render('admin/showuser', { user: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
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

// Add new user
const addUser = async (req, res) => {
    try {
        const { username, password, role, program_studi_id, fakultas_id } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        await User.create({
            username,
            password: hashedPassword,
            role,
            program_studi_id,
            fakultas_id
        });

        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const { username, role, program_studi_id, fakultas_id } = req.body;
        await User.update(
            { username, role, program_studi_id, fakultas_id },
            { where: { user_id: userID } }
        );
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user
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

// Mahasiswa operations
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

const addFakultas = async (req, res) => {
    try {
        const { nama_fakultas } = req.body;
        await Fakultas.create({ nama_fakultas });
        res.redirect('/admin');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProgramStudi = async (req, res) => {
    try {
        const { nama_program_studi, fakultas_id } = req.body;
        await ProgramStudi.create({ nama_program_studi, fakultas_id });
        res.redirect('/admin');
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
    deleteMahasiswa,
    addFakultas,
    addProgramStudi
};
