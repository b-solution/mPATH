'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contract_vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      contract_sub_category_id: {
        type: Sequelize.INTEGER
      },
      contract_agency_id: {
        type: Sequelize.INTEGER
      },
      contract_vehicle_type_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.TEXT
      },
      ceiling: {
        type: Sequelize.DECIMAL
      },
      base_period_start: {
        type: Sequelize.DATE
      },
      base_period_end: {
        type: Sequelize.DATE
      },
      option_period_start: {
        type: Sequelize.DATE
      },
      option_period_end: {
        type: Sequelize.DATE
      },
      contract_number_id: {
        type: Sequelize.INTEGER
      },
      caf_fees: {
        type: Sequelize.DECIMAL
      },
      subprime_name: {
        type: Sequelize.TEXT
      },
      prime_name: {
        type: Sequelize.TEXT
      },
      contract_name: {
        type: Sequelize.TEXT
      },
      is_subprime: {
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
    await queryInterface.dropTable('contract_vehicles');
  }
};