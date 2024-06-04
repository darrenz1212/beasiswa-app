const requireAuth = (req, res, next) => {
    if (req.session && req.session.user_id) {
        next();
    } else {
        res.redirect('/auth');
    }
};

module.exports = {
    requireAuth
};
