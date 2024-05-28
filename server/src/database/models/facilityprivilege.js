"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FacilityPrivilege extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User);
      // this.belongsTo(models.FacilityProject);
      // this.belongsTo(models.Facility);
      // this.belongsTo(models.Project)
    }
    static PRIVILEGE_MODULE = {
      admin: "admin",
      overview: "analytics",
      tasks: "tasks",
      issues: "issues",
      risks: "risks",
      notes: "notes",
      lessons: "lessons",
    };
  }
  FacilityPrivilege.init(
    {
      overview: DataTypes.STRING,
      tasks: DataTypes.STRING,
      notes: DataTypes.STRING,
      issues: DataTypes.STRING,
      admin: DataTypes.STRING,
      risks: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      facility_project_id: DataTypes.INTEGER,
      facility_id: DataTypes.INTEGER,
      lessons: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      group_number: DataTypes.INTEGER,
      facility_project_ids: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "facility_privileges",
      modelName: "FacilityPrivilege",
      underscored: true,
    }
  );
  return FacilityPrivilege;
};
