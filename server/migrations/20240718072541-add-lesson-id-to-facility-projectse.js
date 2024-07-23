"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("facility_projects", "lesson_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if this column is mandatory
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("facility_projects", "lesson_id");
  },
};
