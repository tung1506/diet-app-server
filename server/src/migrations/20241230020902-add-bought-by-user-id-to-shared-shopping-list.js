'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('SharedShoppingLists', 'bought_by_user_id');
        await queryInterface.addColumn('SharedShoppingLists', 'bought_by_user_id', {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true, // Set to true if you want to allow null values
            references: {
                model: 'Users', // Reference to the Users table
                key: 'id', // The field in the referenced table to link
            },
            onDelete: 'SET NULL', // If the user is deleted, set this field to null
            comment: 'User  ID of the person who bought the shopping list' // Optional comment for clarity
        });
        await queryInterface.addColumn('SharedShoppingLists', 'is_bought', {
            type: Sequelize.BOOLEAN,
            allowNull: true, // Set to true if you want to allow null values
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('SharedShoppingLists', 'bought_by_user_id');
    }
};