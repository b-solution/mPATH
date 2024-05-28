// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("facility_projects", {
      fields: ["facility_id"],
      type: "foreign key",
      name: "fk_facility_id",
      references: {
        table: "facilities",
        field: "id",
      },
      onDelete: "CASCADE", // Add onDelete option for cascade delete
      onUpdate: "CASCADE", // Add onUpdate option for cascade update if needed
    });

    await queryInterface.addConstraint("facility_projects", {
      fields: ["project_id"],
      type: "foreign key",
      name: "fk_project_id",
      references: {
        table: "projects",
        field: "id",
      },
      onDelete: "CASCADE", // Add onDelete option for cascade delete
      onUpdate: "CASCADE", // Add onUpdate option for cascade update if needed
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("facility_projects", "fk_facility_id");
    await queryInterface.removeConstraint("facility_projects", "fk_project_id");
  },
};
