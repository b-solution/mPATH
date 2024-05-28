"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IssueStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.ProjectIssueStage);
      this.belongsToMany(models.Project, { through: models.ProjectIssueStage, foreignKey: "", otherKey: "" });
    }
  }
  IssueStage.init(
    {
      name: DataTypes.STRING,
      percentage: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "issue_stages",
      modelName: "IssueStage",
      underscored: true,
    }
  );
  return IssueStage;
};
