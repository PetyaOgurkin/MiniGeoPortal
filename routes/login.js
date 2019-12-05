const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const { guest, client } = require('../middleware/permisson');
const { PROXY_URL } = require('../keys/index');

const router = Router();

router.get('/', guest, (req, res) => {

    res.render('login', {
        title: 'Авторизация',
        isLogin: true,
        error: req.flash('error')
    })
})

router.get('/logout', client, async (req, res) => {
    req.session.destroy(() => {
        res.redirect(PROXY_URL + '');
    });
})

router.post('/', guest, async (req, res) => {

    try {
        const { login, password } = req.body;

        const user = await User.findOne({ where: { name: login.toLowerCase() }, raw: true });

        if (user) {
            const password_check = await bcrypt.compare(password.toLowerCase(), user.password);
            if (password_check) {
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect(PROXY_URL + '');
                });
            }
            else {
                req.flash('error', 'Неверный пароль');
                res.redirect(PROXY_URL + 'login');
            }
        }
        else {
            req.flash('error', 'Такого пользователя не существует');
            res.redirect(PROXY_URL + 'login');
        }
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;