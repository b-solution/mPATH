'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_privileges', {
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
      risks: {
        type: Sequelize.STRING
      },
      lessons: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      project_ids: {
        type: Sequelize.STRING
      },
      contracts: {
        type: Sequelize.STRING
      },
      cn_overview: {
        type: Sequelize.STRING
      },
      cn_tasks: {
        type: Sequelize.STRING
      },
      cn_notes: {
        type: Sequelize.STRING
      },
      cn_issues: {
        type: Sequelize.STRING
      },
      cn_risks: {
        type: Sequelize.STRING
      },
      cn_lessons: {
        type: Sequelize.STRING
      },
      admin_groups: {
        type: Sequelize.STRING
      },
      admin_contracts: {
        type: Sequelize.STRING
      },
      admin_facilities: {
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
    await queryInterface.dropTable('project_privileges');
  }
};