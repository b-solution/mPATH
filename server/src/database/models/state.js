'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
//       // define association here
//       this.hasMany(models.RegionState);
// this.belongsToMany(models.FacilityGroup,{through: models.RegionState, foreignKey: '', otherKey: '' })

    }
  }
  State.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    center: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'states',
    modelName: 'State',
    underscored: true
  });
  return State;
};