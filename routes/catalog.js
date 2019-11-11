const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('catalog', {
        title: 'Каталог',
        isCatalog: true
    })
})

router.get('/:subcatalog', (req, res) => {
    res.render('subcatalog', {
        title: 'Подкаталог',
    })
})

router.get('/:subcatalog/:map', (req, res) => {
    res.render('map', {
        title: 'Карта',
        isMap: true
    })
})

module.exports = router;