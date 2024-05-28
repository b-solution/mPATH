'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('risks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      risk_description: {
        type: Sequelize.TEXT
      },
      impact_description: {
        type: Sequelize.TEXT
      },
      start_date: {
        type: Sequelize.DATE
      },
      due_date: {
        type: Sequelize.DATE
      },
      auto_calculate: {
        type: Sequelize.BOOLEAN
      },
      progress: {
        type: Sequelize.INTEGER
      },
      probability: {
        type: Sequelize.INTEGER
      },
      impact_level: {
        type: Sequelize.INTEGER
      },
      priority_level: {
        type: Sequelize.INTEGER
      },
      risk_approach: {
        type: Sequelize.INTEGER
      },
      risk_approach_description: {
        type: Sequelize.TEXT
      },
      watched: {
        type: Sequelize.BOOLEAN
      },
      watched_at: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      facility_project_id: {
        type: Sequelize.INTEGER
      },
      task_type_id: {
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      kanban_order: {
        type: Sequelize.INTEGER
      },
      risk_stage_id: {
        type: Sequelize.INTEGER
      },
      probability_name: {
        type: Sequelize.STRING
      },
      impact_level_name: {
        type: Sequelize.STRING
      },
      probability_description: {
        type: Sequelize.TEXT
      },
      approval_time: {
        type: Sequelize.STRING
      },
      approved: {
        type: Sequelize.BOOLEAN
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
      explanation: {
        type: Sequelize.TEXT
      },
      duration: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      duration_name: {
        type: Sequelize.STRING
      },
      status_name: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('risks');
  }
};