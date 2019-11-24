const { body, param, check } = require('express-validator');

exports.сatalogValidators = [
    body('title', 'Минимальная длина названия 3 символа').isLength({ min: 3 }),
    body('discription', 'Минимальная длина описания 3 символа').isLength({ min: 3 }),
    body('publicity').custom((value) => {
        if (['1', '2', '3'].indexOf(value) === -1) {
            throw new Error('Неверное значение уровня доступа');
        }
        return true
    })
]

/*
exports.loginValidators = [
    check('session').custom(value => {
        console.log(value);

    })
] */