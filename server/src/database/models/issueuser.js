"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IssueUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User);
      this.belongsTo(models.Issue, { onDelete: "CASCADE" });
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
  IssueUser.init(
    {
      user_id: DataTypes.INTEGER,
      issue_id: DataTypes.INTEGER,
      user_type: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "issue_users",
      modelName: "IssueUser",
      underscored: true,
    }
  );
  return IssueUser;
};
