function requireAuth(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/auth/login');
    }
    next();
}

module.exports = { requireAuth };
