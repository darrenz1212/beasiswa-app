const requireAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
};

const requireMahasiswa = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'mahasiswa') {
        next();
    } else {
        res.status(403).send('Forbidden: Mahasiswa only');
    }
};

module.exports = {
    requireAdmin,
    requireMahasiswa
};
