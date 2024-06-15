const { User, Mahasiswa } = require('../../models');
const bcrypt = require('bcrypt');

const index = (req, res) => {
    const error = req.flash('error');
    res.render('auth/register', { error });
};

const register = async (req, res) => {
    const { username, password, role, program_studi_id, fakultas_id } = req.body;

    try {
        if (!username || !password || !role) {
            req.flash('error', 'Username, password, and role are required.');
            return res.redirect('/auth/register');
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            program_studi_id: program_studi_id || null,
            fakultas_id: fakultas_id || null,
        });

        console.log('New user created:', newUser);

        // Find the user to get user_id
        const cUser = await User.findOne({ where: { username } });

        console.log('Current user found:', cUser);

        if (cUser.role === 'mahasiswa') {
            console.log('Attempting to create Mahasiswa');
            await Mahasiswa.create({
                user_id: cUser.user_id,
                nama_mahasiswa: cUser.username,
                program_studi_id: cUser.program_studi_id,
                ipk_terakhir: 0,
                status_aktif: true
            });
            console.log("Mahasiswa berhasil ditambah");
        }

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error', 'Registration failed: ' + error.message);
        res.redirect('/auth/register');
    }
};

module.exports = {
    index,
    register
};
