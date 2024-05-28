'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('efforts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_of_week: {
        type: Sequelize.DATE
      },
      hours: {
        type: Sequelize.DECIMAL
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      resource_id: {
        type: Sequelize.INTEGER
      },
      resource_type: {
        type: Sequelize.STRING
      },
      facility_project_id: {
        type: Sequelize.INTEGER
      },
      projected: {
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
    await queryInterface.dropTable('efforts');
  }
};