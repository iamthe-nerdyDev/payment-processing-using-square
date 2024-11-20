require('dotenv').config();

const config = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
};

module.exports = { development: config, test: config, production: config };
