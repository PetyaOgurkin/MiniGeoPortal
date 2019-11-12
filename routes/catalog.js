const { Router } = require('express');
const Catalog = require('../models/catalogs');
const Maps = require('../models/map');
const router = Router();

router.get('/', async (req, res) => {

    try {
        const catalog = await Catalog.findAll({ raw: true });

        res.render('catalog', {
            title: 'Каталог',
            isCatalog: true,
            catalog
        })
    } catch (error) {
        console.error(error);
    }

})

router.get('/:subcatalog', async (req, res) => {
    if (req.params.subcatalog === "add") {
        res.render('add_catalog', {
            title: 'Добавить каталог'
        })
    }
    else {
        const maps = await Maps.findAll({ raw: true });

        res.render('subcatalog', {
            title: 'Подкаталог',
            id: req.params.subcatalog,
            maps
        })
    }
})

router.get('/:subcatalog/:map', async (req, res) => {
    try {
        if (req.params.map === "add") {

            const catalog = await Catalog.findByPk(req.params.subcatalog, { raw: true });
            res.render('add_map', {
                title: 'Добавить карту',
                catalog
            })
        }
        else {
            res.render('map', {
                title: 'Карта',
                isMap: true
            })
        }
    } catch (error) {
        console.error(error);
    }
})

router.post('/add', async (req, res) => {
    try {
        const { title, discription, publicity } = req.body;

        await Catalog.create({
            title,
            discription,
            publicity,
            img_url: req.file.path
        });

        res.status(201).redirect('/catalog');
    } catch (error) {
        console.error(error);
    }
})

router.post('/:subcatalog/add', async (req, res) => {
    try {
        const { title, discription, publicity, url } = req.body;

        await Maps.create({
            title,
            discription,
            publicity,
            url,
            parent_catalog: req.params.subcatalog,
            img_url: req.file.path,
        });

        res.status(201).redirect('/catalog/' + req.params.subcatalog);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;