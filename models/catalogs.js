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
    items: {
        type: Sequelize.ARRAY,
        
    }
})

module.exports = catalog;