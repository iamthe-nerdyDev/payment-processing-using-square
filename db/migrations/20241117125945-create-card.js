'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            squareCardId: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            verificationToken: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            enabled: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            last4: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cardholderName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cardBrand: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cardType: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            expMonth: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            expYear: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            metadata: {
                allowNull: true,
                type: Sequelize.JSONB,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cards');
    },
};
