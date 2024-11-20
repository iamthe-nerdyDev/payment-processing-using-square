'use strict';
require('dotenv').config();

const bcryptjs = require('bcryptjs');
const { Client, Environment } = require('square');
const { user } = require('../../shared/informations.test.json');

const client = new Client({
    environment: Environment.Sandbox,
    squareVersion: '2024-10-17',
    bearerAuthCredentials: {
        accessToken: process.env.SQUARE_ACCESS_TOKEN,
    },
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const response = await client.customersApi.createCustomer({
            emailAddress: user.emailAddress,
            familyName: user.lastName,
            givenName: user.firstName,
        });

        const customer = response.result.customer;

        const toMetadata = (obj) => {
            return JSON.parse(
                JSON.stringify(obj, (_, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                )
            );
        };

        await queryInterface.bulkInsert('users', [
            {
                id: user.id,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                password: bcryptjs.hashSync(user.password, 10),
                squareCustomerId: customer.id,
                metadata: JSON.stringify(toMetadata(customer)),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', { id: user.id }, {});
    },
};
