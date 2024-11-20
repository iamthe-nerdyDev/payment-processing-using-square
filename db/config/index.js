require('dotenv').config();

const config = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
};

console.log(config);

module.exports = { development: config, test: config, production: config };
