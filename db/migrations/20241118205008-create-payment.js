'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
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
            cardId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'cards',
                    key: 'id',
                },
            },
            reference: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            amount: {
                allowNull: false,
                type: Sequelize.DECIMAL,
            },
            currency: {
                allowNull: false,
                type: Sequelize.ENUM('EUR', 'USD'),
            },
            status: {
                allowNull: false,
                defaultValue: 'initiated',
                type: Sequelize.ENUM('initiated', 'failed', 'successful', 'cancelled'),
            },
            squarePaymentId: {
                type: Sequelize.STRING,
            },
            metadata: {
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
        await queryInterface.dropTable('payments');
    },
};
