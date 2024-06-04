const { User } = require('../../models');
const bcrypt = require('bcrypt');
const session = require('express-session');

const index = (req, res) => {
    res.render('auth/login');
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user_id = user.user_id;
            req.session.username = user.username;
            req.session.role = user.role;

            if (user.role === 'admin') {
                res.redirect('/admin');
            } else if (user.role === 'mahasiswa') {
                res.redirect('/mahasiswa');
            } else {
                res.redirect('/');
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/auth/login');
    });
};

module.exports = {
    index,
    login,
    logout
};
