"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IssueType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.ProjectIssueType);
      this.belongsToMany(models.Project, { through: models.ProjectIssueType, foreignKey: "", otherKey: "" });
    }
  }
  IssueType.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "issue_types",
      modelName: "IssueType",
      underscored: true,
    }
  );
  return IssueType;
};
