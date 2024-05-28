'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      encrypted_password: {
        type: Sequelize.STRING
      },
      reset_password_token: {
        type: Sequelize.STRING
      },
      reset_password_sent_at: {
        type: Sequelize.DATE
      },
      sign_in_count: {
        type: Sequelize.INTEGER
      },
      current_sign_in_at: {
        type: Sequelize.DATE
      },
      last_sign_in_at: {
        type: Sequelize.DATE
      },
      current_sign_in_ip: {
        type: Sequelize.STRING
      },
      last_sign_in_ip: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER
      },
      provider: {
        type: Sequelize.STRING
      },
      uid: {
        type: Sequelize.STRING
      },
      login: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.STRING
      },
      lng: {
        type: Sequelize.STRING
      },
      country_code: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      organization_id: {
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      project_type_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      progress: {
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
    await queryInterface.dropTable('users');
  }
};