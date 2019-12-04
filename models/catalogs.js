const Sequelize = require('sequelize');
const db = require('../utils/database');

const catalog = db.define('Catalog', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publicity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    full_discription: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    short_discription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    img_url: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = catalog;