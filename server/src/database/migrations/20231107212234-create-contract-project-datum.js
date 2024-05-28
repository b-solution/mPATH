'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contract_project_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      charge_code: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      contract_customer_id: {
        type: Sequelize.INTEGER
      },
      contract_award_to_id: {
        type: Sequelize.INTEGER
      },
      contract_type_id: {
        type: Sequelize.INTEGER
      },
      prime_or_sub: {
        type: Sequelize.STRING
      },
      contract_start_date: {
        type: Sequelize.DATE
      },
      contract_end_date: {
        type: Sequelize.DATE
      },
      total_contract_value: {
        type: Sequelize.DECIMAL
      },
      contract_pop_id: {
        type: Sequelize.INTEGER
      },
      contract_current_pop_id: {
        type: Sequelize.INTEGER
      },
      contract_current_pop_start_date: {
        type: Sequelize.DATE
      },
      contract_current_pop_end_date: {
        type: Sequelize.DATE
      },
      total_founded_value: {
        type: Sequelize.DECIMAL
      },
      billings_to_date: {
        type: Sequelize.DECIMAL
      },
      comments: {
        type: Sequelize.STRING
      },
      contract_naic_id: {
        type: Sequelize.INTEGER
      },
      contract_vehicle_id: {
        type: Sequelize.INTEGER
      },
      contract_award_type_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.STRING
      },
      co_contract_poc_id: {
        type: Sequelize.INTEGER
      },
      gov_contract_poc_id: {
        type: Sequelize.INTEGER
      },
      pm_contract_poc_id: {
        type: Sequelize.INTEGER
      },
      contract_number_id: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
      },
      ignore_expired: {
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
    await queryInterface.dropTable('contract_project_data');
  }
};