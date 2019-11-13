const Sequelize = require('sequelize');

const DB_NAME = 'client_db';
const USER_NAME = 'client';
const PASSWORD = 'client';


const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: '172.16.132.45',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;