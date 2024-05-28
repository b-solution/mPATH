'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacilityGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // this.hasMany(models.Facility,{ foreignKey: 'facility_group_id' });
      // this.hasMany(models.FacilityProject,{ foreignKey: 'facility_project_id' });
      // this.hasMany(models.ProjectContract);
      // this.hasMany(models.ProjectContractVehicle);
      this.hasMany(models.ProjectFacilityGroup);
      // this.belongsToMany(models.Project,{through: models.ProjectFacilityGroup, foreignKey: '', otherKey: '' });
      // this.hasMany(models.Contract)

    }
    toJSON() {
      let h = {...super.toJSON()}
      h['status'] = this.getStatus(h['status']) 
      return h;
    }
    getStatus(v){
      return {
        0: 'inactive', 1: 'active'
      }[v]   
    }
  }
  FacilityGroup.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    status: DataTypes.INTEGER,
    region_type: DataTypes.INTEGER,
    center: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    progress: DataTypes.INTEGER,
    is_portfolio: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    owner_type: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'facility_groups',
    modelName: 'FacilityGroup',
    underscored: true
  });
  return FacilityGroup;
};