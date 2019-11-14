const { Router } = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Op = Sequelize.Op;

const router = Router();

router.get('/', async (req, res) => {

    try {
        const users = await User.findAll({ where: { permission_level: { [Op.lte]: 2 } }, raw: true });

        users.forEach(user => {
            if (user.permission_level === 1) {
                user.permission_level = "Пользователь";
            }
            else if (user.permission_level === 2) {
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

router.post('/adduser', async (req, res) => {
    try {
        const { name, password, permission_level } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        User.create({
            name,
            password: hashPassword,
            permission_level
        }).then(task => {
            const responce = {
                name,
                permission_level: permission_level === "1" ? "Пользователь" : permission_level === "2" ? "Модератор" : null,
                id: task.dataValues.id
            }

            res.status(201).json(responce);
        });

    } catch (error) {
        console.error(error);
    }
})


module.exports = router;