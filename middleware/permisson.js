const { PROXY_URL } = require('../keys/index');

const permisson = (req, res, next, lvl) => {
    if (!req.session.isAuthenticated) {
        return res.redirect(PROXY_URL + '');
    }
    if (req.session.user.permission_level < lvl) {
        return res.redirect(PROXY_URL + '');
    }
    next();
}

exports.admin = (req, res, next) => permisson(req, res, next, 3);

exports.mod = (req, res, next) => permisson(req, res, next, 2);

exports.client = (req, res, next) => permisson(req, res, next, 1);

exports.guest = function (req, res, next) {
    if (req.session.isAuthenticated) {
        return res.redirect(PROXY_URL + '');
    }
    next();
}