"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("role_privileges", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if this column is mandatory
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("role_privileges", "user_id");
  },
};
