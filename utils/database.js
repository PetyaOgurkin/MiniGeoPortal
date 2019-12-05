const Sequelize = require('sequelize');
const { DB_NAME, USER_NAME, DB_PASSWORD, DB_URL } = require('../keys/index');

const sequelize = new Sequelize(DB_NAME, USER_NAME, DB_PASSWORD, {
    host: DB_URL,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;