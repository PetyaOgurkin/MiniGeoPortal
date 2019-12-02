const { Router } = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/users');
const { admin } = require('../middleware/permisson');
const { addUserValidators, editUserValidators } = require('../utils/validators');
const Op = Sequelize.Op;

const router = Router();

router.get('/', admin, async (req, res) => {

    try {
        const users = await User.findAll({ where: { permission_level: { [Op.lte]: 2 } }, order: ['id'], raw: true });

        users.forEach(user => {
            if (user.permission_level === 1) {
                user.permission_level = "Пользователь";
            }
            else if (user.permission_level === 2) {
                user.permission_level = "Редактор";
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

router.post('/adduser', admin, addUserValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
                csrf: req.csrfToken()
            });
        }
        const { name, password, permission_level } = req.body;
        const hashPassword = await bcrypt.hash(password.toLowerCase(), 10);
        User.create({
            name: name.toLowerCase(),
            password: hashPassword,
            permission_level
        }).then(task => {
            const responce = {
                name,
                permission_level: permission_level === "1" ? "Пользователь" : permission_level === "2" ? "Редактор" : null,
                id: task.dataValues.id,
                csrf: req.csrfToken()
            }

            res.status(201).json(responce);
        });

    } catch (error) {
        console.error(error);
    }
})

router.put('/edituser', admin, editUserValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
                csrf: req.csrfToken()
            });
        }

        const { password, permission_level, id } = req.body;

        if (password !== null) {
            if (!(password.match(/^[a-z0-9]+$/i) && password.length >= 3 && password.length <= 255)) {
                return res.status(422).json({
                    error: 'Некорректный пароль',
                    csrf: req.csrfToken()
                });
            }
        }

        if (!Number.isInteger(+id)) {
            return res.status(422).json({
                error: 'Такого пользователя не существует',
                csrf: req.csrfToken()
            });
        }

        const user = await User.findByPk(+id);
        if (user) {
            user.permission_level = permission_level;
            if (password !== null) {
                const hashPassword = await bcrypt.hash(password.toLowerCase(), 10);
                user.password = hashPassword;
            }

            await user.save();

            user.dataValues.csrf = req.csrfToken();

            res.status(200).json(user);
        }
        else {
            return res.status(422).json({
                error: 'Такого пользователя не существует',
                csrf: req.csrfToken()
            });
        }
    } catch (error) {
        console.error(error);
    }
})

router.delete('/deleteuser', admin, async (req, res) => {
    try {
        if (!Number.isInteger(+req.body.id)) {
            return res.status(422).json({
                error: 'Такого пользователя не существует',
                csrf: req.csrfToken()
            });
        }
        const user = await User.findByPk(+req.body.id);
        if (user) {
            await user.destroy();
            res.status(200).json({ csrf: req.csrfToken() });
        }
        else {
            return res.status(422).json({
                error: 'Такого пользователя не существует',
                csrf: req.csrfToken()
            });
        }
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;