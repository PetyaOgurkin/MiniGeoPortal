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
    publicity: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = map;