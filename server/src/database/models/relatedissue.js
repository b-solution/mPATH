"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RelatedIssue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Relatable);
      // this.belongsTo(models.SubIssue)
      this.belongsTo(models.Issue, { foreignKey: "relatable_id", constraints: false });
      this.belongsTo(models.Lesson, { foreignKey: "relatable_id", constraints: false });
      this.belongsTo(models.Task, { foreignKey: "relatable_id", constraints: false });
      this.belongsTo(models.Risk, { foreignKey: "relatable_id", constraints: false });
    }
  }
  RelatedIssue.init(
    {
      relatable_type: DataTypes.STRING,
      issue_id: DataTypes.INTEGER,
      relatable_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RelatedIssue",
    }
  );
  return RelatedIssue;
};
