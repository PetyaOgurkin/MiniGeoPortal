const Sequelize = require('sequelize');
const db = require('../utils/database');

const catalog = db.define('Users', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    permission_level: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = catalog;