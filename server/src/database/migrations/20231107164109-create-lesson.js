'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      date: {
        type: Sequelize.DATE
      },
      stage: {
        type: Sequelize.STRING
      },
      task_type_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      lesson_stage_id: {
        type: Sequelize.INTEGER
      },
      important: {
        type: Sequelize.BOOLEAN
      },
      facility_project_id: {
        type: Sequelize.INTEGER
      },
      reportable: {
        type: Sequelize.BOOLEAN
      },
      draft: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('lessons');
  }
};