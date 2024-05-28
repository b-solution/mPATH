'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegionState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
//       // define association here
//       this.belongsTo(models.FacilityGroup);
// this.belongsTo(models.State)

    }
  }
  RegionState.init({
    facility_group_id: DataTypes.INTEGER,
    state_id: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'region_stages',
    modelName: 'RegionState',
    underscored: true
  });
  return RegionState;
};