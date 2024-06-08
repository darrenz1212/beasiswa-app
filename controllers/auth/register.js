const { User } = require('../../models');
const bcrypt = require('bcrypt');

const index = (req, res) => {
    const error = req.flash('error');
    res.render('auth/register', { error });
};

const register = async (req, res) => {
    const { username, password, role, program_studi_id, fakultas_id } = req.body;

    try {
        if (!password) {
            req.flash('error', 'Password is required');
            return res.redirect('/auth/register');
        }

        console.log('Registering user:', req.body); // Debug log

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Hashed Password:', hashedPassword); // Debug log

        // Create the new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            program_studi_id,
            fakultas_id
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during registration:', error.message); // Debug log
        req.flash('error', error.message);
        res.redirect('/auth/register');
    }
};

module.exports = {
    index,
    register
};
