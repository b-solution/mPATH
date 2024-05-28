"use strict";

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
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint to issues table referencing facility_projects table
    await queryInterface.addConstraint("issues", {
      fields: ["facility_project_id"],
      type: "foreign key",
      name: "fk_facility_project_id_issue", // Set a name for the constraint if it doesn't have one already
      references: {
        table: "facility_projects",
        field: "id",
      },
      onDelete: "CASCADE", // Add onDelete option for cascade delete
      onUpdate: "CASCADE", // Add onUpdate option for cascade update if needed
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint during rollback
    await queryInterface.removeConstraint("issues", "fk_facility_project_id_issue");
  },
};
