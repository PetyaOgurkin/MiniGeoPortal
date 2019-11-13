const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

const router = Router();

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {

    req.session.destroy(() => {
        res.redirect('/');
    });
})

router.post('/', async (req, res) => {

    try {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { name: login }, raw: true });

        if (user) {
            const password_check = await bcrypt.compare(password, user.password);
            if (password_check) {
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/');
                });
            }
            else {
                res.redirect('/login');
            }
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;