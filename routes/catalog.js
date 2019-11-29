const { Router } = require('express');
const Sequelize = require('sequelize');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Catalog = require('../models/catalogs');
const Maps = require('../models/map');
const { сatalogValidators, mapValidators } = require('../utils/validators');
const { mod } = require('../middleware/permisson');
const router = Router();
const Op = Sequelize.Op;


router.get('/', async (req, res) => {

    try {
        let catalog;

        if (req.session.isAuthenticated) {
            const user_lvl = +req.session.user.permission_level + 1;
            catalog = await Catalog.findAll({ where: { publicity: { [Op.lte]: user_lvl } }, order: ['id'], raw: true });
        }
        else {
            catalog = await Catalog.findAll({ where: { publicity: 1 }, order: ['id'], raw: true });
        }

        res.render('catalog', {
            title: 'Каталог',
            isCatalog: true,
            catalog
        })

    } catch (error) {
        console.error(error);
    }

})

router.get('/add', mod, (req, res) => {
    res.render('add_catalog', {
        title: 'Добавить каталог',
        error: req.flash('error')
    })
})

router.get('/:subcatalog', async (req, res) => {

    try {
        if (!Number.isInteger(+req.params.subcatalog)) {
            return res.redirect('/catalog')
        }

        const catalog = await Catalog.findByPk(req.params.subcatalog, { raw: true });
        if (catalog) {
            if (req.session.isAuthenticated) {
                const user_lvl = +req.session.user.permission_level + 1;
                if (catalog.publicity > user_lvl) {
                    return res.redirect('/catalog');
                }
            }
            else {
                if (catalog.publicity > 1) {
                    return res.redirect('/catalog');
                }
            }
        }
        else {
            return res.redirect('/catalog');
        }

        let maps;

        if (req.session.isAuthenticated) {
            const user_lvl = +req.session.user.permission_level + 1;
            maps = await Maps.findAll({ where: { parent_catalog: req.params.subcatalog, publicity: { [Op.lte]: user_lvl } }, order: ['id'], raw: true });
        }
        else {
            maps = await Maps.findAll({ where: { parent_catalog: req.params.subcatalog, publicity: 1 }, order: ['id'], raw: true });
        }

        res.render('subcatalog', {
            title: catalog.title,
            isCatalog: true,
            maps,
            catalog
        })
    } catch (error) {
        console.error(error);
    }
})

router.get('/:subcatalog/edit', mod, async (req, res) => {

    if (!req.query.allow) {
        return res.redirect('/catalog/' + req.params.subcatalog);
    }

    try {
        if (Number.isInteger(+req.params.subcatalog)) {
            const catalog = await Catalog.findByPk(req.params.subcatalog, { raw: true });
            if (catalog) {
                res.render('edit_catalog', {
                    title: 'Редактирование каталога',
                    catalog
                })
            }
            else {
                return res.redirect('/catalog');
            }
        }
        else {
            return res.redirect('/catalog');
        }

    } catch (error) {
        console.error(error);
    }

})

router.get('/:subcatalog/add', mod, async (req, res) => {
    try {

        if (!Number.isInteger(+req.params.subcatalog)) {
            return res.redirect('/catalog');
        }

        const catalog = await Catalog.findByPk(req.params.subcatalog, { raw: true });
        if (catalog) {
            res.render('add_map', {
                title: 'Добавить карту',
                isEditMap: true,
                catalog
            })
        }
        else {
            return res.redirect('/catalog');
        }

    } catch (error) {
        console.error(error);
    }
})

router.get('/:subcatalog/:map/edit', mod, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/catalog/' + req.params.subcatalog);
    }
    try {
        if (!Number.isInteger(+req.params.map)) {
            return res.redirect('/catalog/' + req.params.subcatalog);
        }

        const map = await Maps.findByPk(+req.params.map, { raw: true });

        if (map) {
            const catalogs = await Catalog.findAll({ attributes: ['id', 'title'], raw: true });
            if (catalogs) {
                res.render('edit_map', {
                    title: 'Редактирование карты',
                    isEditMap: true,
                    map,
                    catalogs
                })
            }
        }
        else {
            res.redirect('/catalog/' + req.params.subcatalog);
        }

    } catch (error) {
        console.error(error);
    }
})

router.get('/:subcatalog/:map', async (req, res) => {
    try {
        if (!Number.isInteger(+req.params.map)) {
            return res.redirect('/catalog/' + req.params.subcatalog);
        }

        const map = await Maps.findByPk(+req.params.map, { raw: true });
        if (map) {
            if (req.session.isAuthenticated) {
                const user_lvl = +req.session.user.permission_level + 1;
                if (map.publicity > user_lvl) {
                    return res.redirect('/catalog/' + req.params.subcatalog);
                }
            }
            else {
                if (map.publicity > 1) {
                    return res.redirect('/catalog/' + req.params.subcatalog);
                }
            }

            res.render('map', {
                layout: 'map',
                title: 'Карта',
                isMap: true,
                map
            })
        }
        else {
            res.redirect('/catalog/' + req.params.subcatalog);
        }

    } catch (error) {
        console.error(error);
    }
})

router.post('/add', mod, сatalogValidators, async (req, res) => {
    try {
        const { title, discription, publicity } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('add_catalog', {
                title: 'Добавить каталог',
                error: errors.array()[0].msg,
                data: {
                    title: req.body.title,
                    discription: req.body.discription,
                    publicity: req.body.publicity
                }
            });
        }

        if (req.file) {
            await Catalog.create({
                title,
                discription,
                publicity,
                img_url: req.file.path
            });

            res.status(201).redirect('/catalog');
        }
        else {
            req.flash('error', 'Файл изображения должен быть формата соответсвующего формата.');
            return res.status(422).render('add_catalog', {
                title: 'Добавить каталог',
                error: req.flash('error'),
                data: {
                    title: req.body.title,
                    discription: req.body.discription,
                    publicity: req.body.publicity
                }
            });
        }

    } catch (error) {
        console.error(error);
    }
})

router.post('/edit', mod, сatalogValidators, async (req, res) => {
    try {
        const { title, discription, publicity, id } = req.body;

        if (!Number.isInteger(+id)) {
            return res.redirect('/catalog');
        }

        const catalog = await Catalog.findByPk(+id);

        if (catalog) {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).render('edit_catalog', {
                    title: 'Редактирование каталога',
                    error: errors.array()[0].msg,
                    catalog: {
                        title,
                        discription,
                        publicity,
                        id: catalog.id
                    }
                });
            }


            if (req.file) {
                fs.unlink('./' + catalog.img_url, (err) => {
                    if (err) throw err;
                });

                catalog.img_url = req.file.path;
            }

            catalog.title = title;
            catalog.discription = discription;
            catalog.publicity = publicity;

            await catalog.save();
            res.status(200).redirect('/catalog');
        }
        else {
            res.redirect('/catalog');
        }

    } catch (error) {
        console.error(error);
    }

})

router.post('/remove', mod, async (req, res) => {
    try {
        if (!Number.isInteger(+req.body.id)) {
            return res.redirect('/catalog');
        }

        const catalog = await Catalog.findByPk(+req.body.id);

        if (catalog) {
            fs.unlink('./' + catalog.img_url, (err) => {
                if (err) throw err;
            });

            await catalog.destroy();

            const maps = await Maps.findAll({ where: { parent_catalog: +req.body.id } });
            if (maps) {
                maps.forEach(async map => {
                    fs.unlink('./' + map.img_url, (err) => {
                        if (err) throw err;
                    });
                    await map.destroy()
                });
            }
            res.status(204).redirect('/catalog');
        }
        else {
            res.redirect('/catalog');
        }

    } catch (error) {
        console.error(error);
    }
})

router.post('/:subcatalog/edit', mapValidators, mod, async (req, res) => {
    try {
        const { title, discription, publicity, url, id, parent_catalog, tile, projection } = req.body;

        if (!Number.isInteger(+req.params.subcatalog)) {
            return res.redirect('/catalog');
        }

        const catalogs = await Catalog.findAll({ attributes: ['id', 'title'], raw: true });

        if (!catalogs) {
            return res.redirect('/catalog');
        }

        const errors = validationResult(req);

        const data = {
            id,
            title,
            discription,
            publicity,
            url,
            projection,
            tile,
            parent_catalog: req.params.subcatalog
        }
        if (!errors.isEmpty()) {
            return res.status(422).render('edit_map', {
                title: 'Редактирование карты',
                error: errors.array()[0].msg,
                isEditMap: true,
                catalogs,
                map: data
            });
        }

        if (!Number.isInteger(+id)) {
            return res.redirect('/catalog/' + req.params.subcatalog);
        }

        const map = await Maps.findByPk(+id);

        if (map) {

            switch (tile) {
                case 'empty':
                    break;
                case 'topo': case 'sentinel': case 'relief_dark':
                    if (projection !== '3576') {
                        req.flash('error', 'Неверное значение проекции');
                        return res.status(422).render('edit_map', {
                            title: 'Редактирование карты',
                            error: req.flash('error'),
                            isEditMap: true,
                            catalogs,
                            map: data
                        });
                    }
                    break;
                case 'osm':
                    if (projection !== '3857') {
                        req.flash('error', 'Неверное значение проекции');
                        return res.status(422).render('edit_map', {
                            title: 'Редактирование карты',
                            error: req.flash('error'),
                            isEditMap: true,
                            catalogs,
                            map: data
                        });
                    }
                    break;
                default:
                    break;
            }

            if (req.file) {
                fs.unlink('./' + map.img_url, (err) => {
                    if (err) throw err;
                });
                map.img_url = req.file.path;
            }

            map.title = title;
            map.discription = discription;
            map.publicity = publicity;
            map.url = url;
            map.parent_catalog = parent_catalog;
            map.tile = tile;
            map.projection = projection;

            await map.save();
            res.status(200).redirect('/catalog/' + req.params.subcatalog);
        }
        else {
            res.redirect('/catalog/' + req.params.subcatalog);
        }

    } catch (error) {
        console.error(error);
    }
})

router.post('/:subcatalog/remove', mod, async (req, res) => {
    try {

        if (!Number.isInteger(+req.params.subcatalog)) {
            return res.redirect('/catalog');
        }

        if (!Number.isInteger(+req.body.id)) {
            return res.redirect('/catalog/' + req.params.subcatalog);
        }

        const map = await Maps.findByPk(+req.body.id);

        if (map) {
            fs.unlink('./' + map.img_url, (err) => {
                if (err) throw err;
            });
            await map.destroy();
            res.status(204).redirect('/catalog/' + req.params.subcatalog);
        }
        else {
            res.redirect('/catalog/' + req.params.subcatalog);
        }

    } catch (error) {
        console.error(error);
    }
})

router.post('/:subcatalog/add', mapValidators, mod, async (req, res) => {
    try {
        const { title, discription, publicity, url, projection, tile } = req.body;

        if (!Number.isInteger(+req.params.subcatalog)) {
            return res.redirect('/catalog');
        }

        const catalog = await Catalog.findByPk(req.params.subcatalog, { raw: true });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('add_map', {
                title: 'Добавить карту',
                error: errors.array()[0].msg,
                isEditMap: true,
                catalog,
                data: {
                    title,
                    discription,
                    publicity,
                    url,
                    projection,
                    tile
                }
            });
        }

        if (req.file) {
            switch (tile) {
                case 'empty':
                    break;
                case 'topo': case 'sentinel': case 'relief_dark':
                    if (projection !== '3576') {
                        req.flash('error', 'Неверное значение проекции');
                        return res.status(422).render('add_map', {
                            title: 'Добавить каталог',
                            error: req.flash('error'),
                            isEditMap: true,
                            catalog,
                            data: {
                                title,
                                discription,
                                publicity,
                                url,
                                projection,
                                tile
                            }
                        });
                    }
                    break;
                case 'osm':
                    if (projection !== '3857') {
                        req.flash('error', 'Неверное значение проекции');
                        return res.status(422).render('add_map', {
                            title: 'Добавить каталог',
                            error: req.flash('error'),
                            isEditMap: true,
                            catalog,
                            data: {
                                title,
                                discription,
                                publicity,
                                url,
                                projection,
                                tile
                            }
                        });
                    }
                    break;
                default:
                    break;
            }

            await Maps.create({
                title,
                discription,
                publicity,
                url,
                parent_catalog: req.params.subcatalog,
                img_url: req.file.path,
                projection,
                tile
            });
            res.status(201).redirect('/catalog/' + req.params.subcatalog);
        }
        else {
            req.flash('error', 'Файл изображения должен быть формата соответсвующего формата.');
            return res.status(422).render('add_map', {
                title: 'Добавить каталог',
                error: req.flash('error'),
                isEditMap: true,
                catalog,
                data: {
                    title,
                    discription,
                    publicity,
                    url,
                    projection,
                    tile
                }
            });
        }

    } catch (error) {
        console.error(error);
    }
})

module.exports = router;