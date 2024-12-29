'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Food', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true, // hoặc false nếu bạn muốn cột này là bắt buộc
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Food', 'image_url');
  }
};