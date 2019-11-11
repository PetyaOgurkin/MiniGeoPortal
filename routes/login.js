const { Router } = require('express');
const Users = require('../models/users');

const router = Router();

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.post('/', async (req, res) => {
    console.log(req.body);
    
    try {
        const { login, password } = req.body;

        await Users.create({
            name: login,
            password
        });

        res.status(201).redirect('/login');
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;