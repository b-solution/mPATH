"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //       // define association here
      //       this.belongsTo(models.User);
      this.belongsTo(models.Task, { foreignKey: "task_id" });
    }
    accountable() {
      return this.user_type == "accountable";
    }
    responsible() {
      return this.user_type == "responsible";
    }
    consulted() {
      return this.user_type == "consulted";
    }
    informed() {
      return this.user_type == "informed";
    }
  }
  TaskUser.init(
    {
      user_id: DataTypes.INTEGER,
      task_id: DataTypes.INTEGER,
      user_type: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "task_users",
      modelName: "TaskUser",
      underscored: true,
    }
  );
  return TaskUser;
};
