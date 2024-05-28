'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('facility_groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      region_type: {
        type: Sequelize.INTEGER
      },
      center: {
        type: Sequelize.STRING
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      progress: {
        type: Sequelize.INTEGER
      },
      is_portfolio: {
        type: Sequelize.BOOLEAN
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      owner_id: {
        type: Sequelize.INTEGER
      },
      owner_type: {
        type: Sequelize.STRING
      },
      is_default: {
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
    await queryInterface.dropTable('facility_groups');
  }
};