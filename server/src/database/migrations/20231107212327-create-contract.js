'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contract_type_id: {
        type: Sequelize.INTEGER
      },
      project_code: {
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      contract_status_id: {
        type: Sequelize.INTEGER
      },
      contract_customer_id: {
        type: Sequelize.INTEGER
      },
      contract_vehicle_id: {
        type: Sequelize.INTEGER
      },
      contract_vehicle_number_id: {
        type: Sequelize.INTEGER
      },
      contract_number_id: {
        type: Sequelize.INTEGER
      },
      contract_classification_id: {
        type: Sequelize.INTEGER
      },
      subcontract_number_id: {
        type: Sequelize.INTEGER
      },
      contract_prime_id: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      contract_current_pop_id: {
        type: Sequelize.INTEGER
      },
      current_pop_start_time: {
        type: Sequelize.DATE
      },
      current_pop_end_time: {
        type: Sequelize.DATE
      },
      days_remaining: {
        type: Sequelize.INTEGER
      },
      total_contract_value: {
        type: Sequelize.FLOAT
      },
      current_pop_value: {
        type: Sequelize.FLOAT
      },
      current_pop_funded: {
        type: Sequelize.FLOAT
      },
      total_contract_funded: {
        type: Sequelize.FLOAT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      facility_group_id: {
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      total_subcontracts: {
        type: Sequelize.INTEGER
      },
      contract_category_id: {
        type: Sequelize.INTEGER
      },
      contract_client_type_id: {
        type: Sequelize.INTEGER
      },
      remarks: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('contracts');
  }
};