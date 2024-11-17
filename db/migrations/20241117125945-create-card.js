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
            square_card_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
                unique: true,
            },
            user_uuid: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'user_uuid',
                },
            },
            enabled: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            last_4: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cardholder_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            card_brand: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            card_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            exp_month: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            exp_year: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            metadata: {
                allowNull: true,
                type: Sequelize.JSONB,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cards');
    },
};
