require('dotenv').config();

const config = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
};

module.exports = { development: config, test: config, production: config };
