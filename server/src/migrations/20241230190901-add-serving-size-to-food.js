'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Food', 'serving_size', {
            type: Sequelize.STRING,
            allowNull: true, // Set to true if you want to allow null values
            comment: 'Serving size of the food item' // Optional comment for clarity
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Food', 'serving_size');
    }
};