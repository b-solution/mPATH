"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Project, { foreignKey: "project_id" });
    }
  }
  ProjectUser.init(
    {
      project_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "project_users",
      modelName: "ProjectUser",
      underscored: true,
    }
  );
  return ProjectUser;
};
