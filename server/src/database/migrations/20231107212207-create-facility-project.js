"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("facility_projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      facility_id: {
        type: Sequelize.INTEGER,
      },
      project_id: {
        type: Sequelize.INTEGER,
      },
      due_date: {
        type: Sequelize.DATE,
      },
      status_id: {
        type: Sequelize.INTEGER,
      },
      progress: {
        type: Sequelize.INTEGER,
      },
      color: {
        type: Sequelize.STRING,
      },
      facility_group_id: {
        type: Sequelize.INTEGER,
      },
      project_facility_group_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("facility_projects");
  },
};
