module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;
    if (req.session.user) {
        res.locals.user_name = req.session.user.name;
        res.locals.user_lvl = req.session.user.permission_level;
    }
    else {
        res.locals.user_lvl = 0;
    }
    next();
}