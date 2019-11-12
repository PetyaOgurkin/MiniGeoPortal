const { Router } = require('express');
const User = require('../models/users');

const router = Router();

router.get('/', async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true
    })
})


module.exports = router;