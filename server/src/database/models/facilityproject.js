"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FacilityProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.Facility, { foreignKey: "facility_id", onDelete: "CASCADE" });
      this.belongsTo(models.Project, { onDelete: "CASCADE" });
      this.belongsTo(models.Status);
      this.hasMany(models.Task, { foreignKey: "facility_project_id" });
      // // this.belongsToMany(models.TaskType,{through: models.Task, foreignKey: '', otherKey: '' });
      this.belongsTo(models.Issue);
      // this.hasMany(models.Risk);
      // this.hasMany(models.Lesson);
      // this.hasMany(models.Note);
      // this.hasMany(models.FacilityPrivilege);
      this.belongsTo(models.FacilityGroup);
      // this.hasMany(models.Effort)
    }
  }
  FacilityProject.init(
    {
      // FacilityId:{
      //   type: DataTypes.INTEGER,
      //   field: 'facility_id'
      // },
      facility_id: DataTypes.INTEGER,
      // ProjectId:{
      //   type: DataTypes.INTEGER,
      //   field: 'project_id'
      // },
      project_id: DataTypes.INTEGER,
      due_date: DataTypes.DATE,
      // StatusId: {
      //   type: DataTypes.INTEGER,
      //   field: 'status_id'
      // },
      status_id: DataTypes.INTEGER,
      progress: DataTypes.INTEGER,
      color: DataTypes.STRING,
      // FacilityGroupId: {
      //   type: DataTypes.INTEGER,
      //   field: 'facility_group_id'
      // },
      facility_group_id: DataTypes.INTEGER,
      // ProjectFacilityGroupId: {
      //   type: DataTypes.INTEGER,
      //   field: 'project_facility_group_id'
      // }
      project_facility_group_id: DataTypes.INTEGER,
      issue_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "facility_projects",
      modelName: "FacilityProject",
      underscored: true,
    }
  );
  return FacilityProject;
};
