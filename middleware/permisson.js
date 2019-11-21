const permisson = (req, res, next, lvl) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/');
    }
    if (req.session.user.permission_level < lvl) {
        return res.redirect('/');
    }
    next();
}

exports.admin = (req, res, next) => permisson(req, res, next, 3);

exports.mod = (req, res, next) => permisson(req, res, next, 2);

exports.client = (req, res, next) => permisson(req, res, next, 1);

exports.guest = function (req, res, next) {
    if (req.session.isAuthenticated) {
        return res.redirect('/');
    }
    next();
}