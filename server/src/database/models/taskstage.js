"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //       // define association here
      this.hasMany(models.ProjectTaskStage);
      this.belongsToMany(models.Project, { through: models.ProjectTaskStage, foreignKey: "", otherKey: "" });
    }
  }
  TaskStage.init(
    {
      name: DataTypes.STRING,
      percentage: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "task_stages",
      modelName: "TaskStage",
      underscored: true,
    }
  );
  return TaskStage;
};
