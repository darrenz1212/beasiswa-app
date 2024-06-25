// controllers/auth/login.js
const { User } = require('../../models');
const bcrypt = require('bcrypt');

const index = (req, res) => {
    const error = req.flash('error');
    res.render('auth/login', { error });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user_id = user.user_id;
            req.session.username = user.username; // Set username in session
            req.session.role = user.role;

            if (user.role === 'administrator') {
                return res.redirect('/admin');
            } else if (user.role === 'mahasiswa') {
                return res.redirect('/mahasiswa');
            } else if(user.role === 'program_studi') {
                return res.redirect('/prodi');
            } else if(user.role === 'fakultas') {
                return res.redirect('/fakultas');
            } else {
                return res.redirect('/');
            }
        } else {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/auth/login');
        }
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/auth/login');
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/'); // Handle error if needed
        }
        res.clearCookie('connect.sid'); // Make sure to clear the cookie as well
        res.redirect('/auth/login');
    });
};

module.exports = {
    index,
    login,
    logout
};
