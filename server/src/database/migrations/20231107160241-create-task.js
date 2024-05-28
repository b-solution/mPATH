'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      due_date: {
        type: Sequelize.DATE
      },
      progress: {
        type: Sequelize.INTEGER
      },
      task_type_id: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      facility_project_id: {
        type: Sequelize.INTEGER
      },
      auto_calculate: {
        type: Sequelize.BOOLEAN
      },
      watched: {
        type: Sequelize.BOOLEAN
      },
      watched_at: {
        type: Sequelize.DATE
      },
      task_stage_id: {
        type: Sequelize.INTEGER
      },
      kanban_order: {
        type: Sequelize.INTEGER
      },
      important: {
        type: Sequelize.BOOLEAN
      },
      ongoing: {
        type: Sequelize.BOOLEAN
      },
      draft: {
        type: Sequelize.BOOLEAN
      },
      on_hold: {
        type: Sequelize.BOOLEAN
      },
      reportable: {
        type: Sequelize.BOOLEAN
      },
      closed_date: {
        type: Sequelize.DATE
      },
      contract_id: {
        type: Sequelize.INTEGER
      },
      project_contract_id: {
        type: Sequelize.INTEGER
      },
      project_contract_vehicle_id: {
        type: Sequelize.INTEGER
      },
      owner_id: {
        type: Sequelize.INTEGER
      },
      owner_type: {
        type: Sequelize.STRING
      },
      planned_effort: {
        type: Sequelize.DECIMAL
      },
      actual_effort: {
        type: Sequelize.DECIMAL
      },
      auto_calculate_planned_effort: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('tasks');
  }
};