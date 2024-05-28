"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RelatedTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Relatable);
      // this.belongsTo(models.SubTask)
      this.belongsTo(models.Issue, { foreignKey: "relatable_id", constraints: false });
    }
  }
  RelatedTask.init(
    {
      relatable_type: DataTypes.STRING,
      task_id: DataTypes.INTEGER,
      relatable_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RelatedTask",
    }
  );
  return RelatedTask;
};
