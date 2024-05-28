'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiskStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
//       // define association here
//       this.hasMany(models.ProjectRiskStage);
// this.belongsToMany(models.Project,{through: models.ProjectRiskStage, foreignKey: '', otherKey: '' })

    }
  }
  RiskStage.init({
    name: DataTypes.STRING,
    percentage: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'risk_stages',
    modelName: 'RiskStage',
    underscored: true
  });
  return RiskStage;
};