'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
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
      remember_created_at: {
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
    await queryInterface.dropTable('admin_users');
  }
};