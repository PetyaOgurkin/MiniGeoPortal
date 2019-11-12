const Sequelize = require('sequelize');
const db = require('../utils/database');

const map = db.define('Map', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    parent_catalog: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publicity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    discription: Sequelize.TEXT,
    img_url: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = map;