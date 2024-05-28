"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectTaskStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //       // define association here
      this.belongsTo(models.Project);
      this.belongsTo(models.TaskStage);
    }
  }
  ProjectTaskStage.init(
    {
      project_id: DataTypes.INTEGER,
      task_stage_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "project_task_stages",
      modelName: "ProjectTaskStage",
      underscored: true,
    }
  );
  return ProjectTaskStage;
};
