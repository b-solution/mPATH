"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Privilege extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User);
    }
  }
  Privilege.init(
    {
      overview: DataTypes.STRING,
      tasks: DataTypes.STRING,
      notes: DataTypes.STRING,
      issues: DataTypes.STRING,
      admin: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      map_view: DataTypes.STRING,
      gantt_view: DataTypes.STRING,
      watch_view: DataTypes.STRING,
      documents: DataTypes.STRING,
      members: DataTypes.STRING,
      facility_manager_view: DataTypes.STRING,
      sheets_view: DataTypes.STRING,
      kanban_view: DataTypes.STRING,
      risks: DataTypes.STRING,
      calendar_view: DataTypes.STRING,
      lessons: DataTypes.STRING,
      portfolio_view: DataTypes.STRING,
      settings_view: DataTypes.STRING,
      contract_data: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "privileges",
      modelName: "Privilege",
      underscored: true,
    }
  );
  return Privilege;
};
