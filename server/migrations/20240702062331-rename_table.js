"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the table
    await queryInterface.renameTable("contract_project_data", "contract_project_datum");
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the table name change
    await queryInterface.renameTable("contract_project_datum", "contract_project_data");
  },
};
