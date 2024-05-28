'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('facilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facility_name: {
        type: Sequelize.STRING
      },
      region_name: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      point_of_contact: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      facility_group_id: {
        type: Sequelize.INTEGER
      },
      creator_id: {
        type: Sequelize.INTEGER
      },
      lat: {
        type: Sequelize.STRING
      },
      lng: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      country_code: {
        type: Sequelize.STRING
      },
      project_facility_group_id: {
        type: Sequelize.INTEGER
      },
      is_portfolio: {
        type: Sequelize.BOOLEAN
      },
      project_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('facilities');
  }
};