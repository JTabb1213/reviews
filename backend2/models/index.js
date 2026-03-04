const config = require('config');
const Sequelize = require("sequelize");
const pool = config.get('database.pool');
const dialect = config.get('database.dialect');

console.log(`Using db: ${dialect}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        logging: false,
        port: process.env.DB_PORT,
        dialect: dialect,
        pool: {
            max: pool.max,
            min: pool.min,
            acquire: pool.acquire,
            idle: pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;