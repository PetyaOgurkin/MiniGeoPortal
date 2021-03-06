const { body } = require('express-validator');
const User = require('../models/users');

exports.сatalogValidators = [
    body('title', 'Минимальная длина названия 3 символа, максимальная 255 символов').isLength({ min: 3, max: 255 }).trim(),
    body('full_discription', 'Минимальная длина полного описания 3 символа, максимальная 3000 символов').isLength({ min: 3, max: 3000 }).trim(),
    body('short_discription', 'Минимальная длина краткого описания 3 символа, максимальная 255 символов').isLength({ min: 3, max: 255 }).trim(),
    body('publicity').custom((value) => {
        if (['1', '2', '3'].indexOf(value) === -1) {
            throw new Error('Неверное значение уровня доступа');
        }
        return true
    })
]

exports.mapValidators = [
    body('title', 'Минимальная длина названия 3 символа, максимальная 255 символов').isLength({ min: 3, max: 255 }).trim(),
    body('discription', 'Минимальная длина описания 3 символа, максимальная 3000 символов').isLength({ min: 3, max: 3000 }).trim(),
    body('url', 'Неверное значение WMS URL').isURL().trim(),
    body('tile').custom((value) => {
        if (['empty', 'topo', 'sentinel', 'relief_dark', 'osm'].indexOf(value) === -1) {
            throw new Error('Неверное значение тайловой подложки');
        }
        return true
    }),
    body('projection').custom((value) => {
        if (['3576', '4326', '3857'].indexOf(value) === -1) {
            throw new Error('Неверное значение проекции');
        }
        return true
    }),
    body('publicity').custom((value) => {
        if (['1', '2', '3'].indexOf(value) === -1) {
            throw new Error('Неверное значение уровня доступа');
        }
        return true
    })
]

exports.addUserValidators = [
    body('name', 'Некорректное имя пользователя').isLength({ min: 3, max: 20 }).isAlphanumeric().trim().custom(async value => {
        const user = await User.findOne({ where: { name: value.toLowerCase() }, raw: true });
        if (user) {
            throw new Error('Пользователь с таким именем уже существует');
        }
        return true;
    }),
    body('password', 'Некорректный пароль').isLength({ min: 3, max: 20 }).custom(value => {
        if (!(value.match(/[^а-яА-ЯёЁ]{3,20}/i))) {
            throw new Error('Некорректный пароль');
        }
        return true;
    }).trim(),
    body('permission_level').custom((value) => {
        if (['1', '2', '3'].indexOf(value) === -1) {
            throw new Error('Неверное значение прав пользователя');
        }
        return true
    })
]

exports.editUserValidators = [
    body('permission_level').custom((value) => {
        if (['1', '2', '3'].indexOf(value) === -1) {
            throw new Error('Неверное значение прав пользователя');
        }
        return true
    })
]