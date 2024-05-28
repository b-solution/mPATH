"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IssueSeverity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.ProjectIssueSeverity);
      this.belongsToMany(models.Project, { through: models.ProjectIssueSeverity, foreignKey: "", otherKey: "" });
    }
  }
  IssueSeverity.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "issue_severities",
      modelName: "IssueSeverity",
      underscored: true,
    }
  );
  return IssueSeverity;
};
