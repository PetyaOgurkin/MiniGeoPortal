const { Router } = require('express');
const Sequelize = require('sequelize');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Catalog = require('../models/catalogs');
const Maps = require('../models/map');
const { addCatalogValidators } = require('../utils/validators');
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
        return res.redirect('/catalog');
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
                res.redirect('/catalog');
            }
        }
        else {
            res.redirect('/catalog');
        }

    } catch (error) {
        console.error(error);
    }

})

router.get('/:subcatalog/add', mod, async (req, res) => {
    try {
        const catalog = await Catalog.findByPk(req.params.subcatalog, { raw: true });
        res.render('add_map', {
            title: 'Добавить карту',
            catalog
        })
    } catch (error) {
        console.error(error);
    }
})

router.get('/:subcatalog/:map/edit', mod, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/catalog/' + req.params.subcatalog);
    }
    try {

        const map = await Maps.findByPk(+req.params.map, { raw: true });

        if (map) {
            const catalogs = await Catalog.findAll({ attributes: ['id', 'title'], raw: true });
            if (catalogs) {
                res.render('edit_map', {
                    title: 'Редактирование карты',
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
        if (Number.isInteger(+req.params.map)) {
            const map = await Maps.findByPk(+req.params.map, { raw: true });
            if (map) {
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
        }
        else {
            res.redirect('/catalog/' + req.params.subcatalog);
        }



    } catch (error) {
        console.error(error);
    }
})

router.post('/add', mod, addCatalogValidators, async (req, res) => {
    try {
        const { title, discription, publicity } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.status(422).redirect('/catalog/add');
        }

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

router.post('/edit', mod, async (req, res) => {
    try {
        const { title, discription, publicity, id } = req.body;

        const catalog = await Catalog.findByPk(+id);

        if (catalog) {
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
        const catalog = await Catalog.findByPk(+req.body.id);

        if (catalog) {
            fs.unlink('./' + catalog.img_url, (err) => {
                if (err) throw err;
            });

            await catalog.destroy();

            const maps = await Maps.findAll({ where: { parent_catalog: req.body.id } });
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

router.post('/:subcatalog/edit', mod, async (req, res) => {
    try {
        const { title, discription, publicity, url, id, parent_catalog } = req.body;

        const map = await Maps.findByPk(+id);

        if (map) {
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

router.post('/:subcatalog/add', mod, async (req, res) => {
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