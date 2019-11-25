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


exports.mapValidators = [
    body('title', 'Минимальная длина названия 3 символа').isLength({ min: 3 }),
    body('discription', 'Минимальная длина описания 3 символа').isLength({ min: 3 }),
    body('url', 'Неверное значение WMS URL').isURL(),
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