const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Авторизация',
        isLogin: true
    })
})

module.exports = router;