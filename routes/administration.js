const { Router } = require('express');
const Sequelize = require('sequelize');
const User = require('../models/users');
const Op = Sequelize.Op;

const router = Router();

router.get('/', async (req, res) => {

    try {
       const users  = await User.findAll({ where: { permission_level: { [Op.lte]: 2 } }, raw: true });

        users.forEach(user => {
            if(user.permission_level === 1){
                user.permission_level = "Пользователь";
            }
            else if (user.permission_level === 2){
                user.permission_level = "Модератор";
            }
        });


        res.render('administration', {
            title: 'Администроирование',
            isAdministration: true,
            users
        })
    } catch (error) {
        console.error(error);
    }
})


module.exports = router;