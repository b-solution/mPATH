'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('privileges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      overview: {
        type: Sequelize.STRING
      },
      tasks: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      issues: {
        type: Sequelize.STRING
      },
      admin: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      map_view: {
        type: Sequelize.STRING
      },
      gantt_view: {
        type: Sequelize.STRING
      },
      watch_view: {
        type: Sequelize.STRING
      },
      documents: {
        type: Sequelize.STRING
      },
      members: {
        type: Sequelize.STRING
      },
      facility_manager_view: {
        type: Sequelize.STRING
      },
      sheets_view: {
        type: Sequelize.STRING
      },
      kanban_view: {
        type: Sequelize.STRING
      },
      risks: {
        type: Sequelize.STRING
      },
      calendar_view: {
        type: Sequelize.STRING
      },
      lessons: {
        type: Sequelize.STRING
      },
      portfolio_view: {
        type: Sequelize.STRING
      },
      settings_view: {
        type: Sequelize.STRING
      },
      contract_data: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('privileges');
  }
};