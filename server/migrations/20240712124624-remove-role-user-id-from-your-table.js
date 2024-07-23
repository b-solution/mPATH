"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("role_privileges", "role_user_id");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("role_privileges", "role_user_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to the same as when you added it
    });
  },
};
