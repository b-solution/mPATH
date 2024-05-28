'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ActiveStorageBlobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      record_id: {
        type: Sequelize.BIGINT
      },
      record_type: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      content_type: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.TEXT
      },
      byte_size: {
        type: Sequelize.BIGINT
      },
      checksum: {
        type: Sequelize.STRING
      },
      service_name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ActiveStorageBlobs');
  }
};