"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RelatedRisk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Relatable);
      // this.belongsTo(models.SubRisk)
      this.belongsTo(models.Issue, { foreignKey: "relatable_id", constraints: false });
    }
  }
  RelatedRisk.init(
    {
      relatable_type: DataTypes.STRING,
      risk_id: DataTypes.INTEGER,
      relatable_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RelatedRisk",
    }
  );
  return RelatedRisk;
};
