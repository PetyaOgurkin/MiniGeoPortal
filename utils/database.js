const Sequelize = require('sequelize');

const DB_NAME = 'client';
const USER_NAME = 'postgres';
const PASSWORD = '12345';


const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;