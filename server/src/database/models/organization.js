"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.User, { foreignKey: "organization_id" });
    }
  }
  Organization.init(
    {
      title: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "organizations",
      modelName: "Organization",
      underscored: true,
    }
  );
  return Organization;
};
