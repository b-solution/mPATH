'use strict';

const {_} = require("lodash") 

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectFacilityGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.Project);
      // // this.belongsTo(models.ProjectGroup)
      this.belongsTo(models.FacilityGroup)

    }
    async applyUnassigedToResources(){
      try {
        const { db } = require("./index.js");

        let facility_group = await this.getFacilityGroup()
        let project = await this.getProject()

        if (!facility_group) return;
        
        let facilityProjects = await db.FacilityProject.findAll({where: {facility_group_id: facility_group.id, project_id: project.id}})
    
        let projectContracts = await db.ProjectContract.findAll({where: {facility_group_id: facility_group.id,project_id: project.id}})
    
        let projectContractVehicles = await db.ProjectContractVehicle.findAll({where: {facility_group_id: facility_group.id,project_id: project.id}})

        let groupedFacilityProjects = _.groupBy(facilityProjects, 'project_id');
        let groupedProjectContracts = _.groupBy(projectContracts, 'project_id');
        let groupedProjectContractVehicles = _.groupBy(projectContractVehicles, 'project_id');
        let defaultGroup = await project.getDefaultFacilityGroup()

        for (var key in groupedFacilityProjects) {
          // check also if property is not inherited from prototype
          if (groupedFacilityProjects[key] && groupedFacilityProjects[key].length > 0) { 
            var _fps = groupedFacilityProjects[key];
            await db.FacilityProject.update({ facility_group_id: defaultGroup.id }, { where: { id: _fps.map(fp => fp.id) } });
          }
        }

        for (var key in groupedProjectContracts) {
          // check also if property is not inherited from prototype
          if (groupedProjectContracts[key] && groupedProjectContracts[key].length > 0) { 
            var _fps = groupedProjectContracts[key];
            await db.ProjectContract.update({ facility_group_id: defaultGroup.id }, { where: { id: _fps.map(fp => fp.id) } });
          }
        }

        for (var key in groupedProjectContractVehicles) {
          // check also if property is not inherited from prototype
          if (groupedProjectContractVehicles[key] && groupedProjectContractVehicles[key].length > 0) { 
            var _fps = groupedProjectContractVehicles[key];
            await db.ProjectContractVehicle.update({ facility_group_id: defaultGroup.id }, { where: { id: _fps.map(fp => fp.id) } });
          }
        }

      } catch (error) {
        throw new Error(`Error applying unassigned to resource: ${error}`);
      }
            
    }
  }
  ProjectFacilityGroup.init({
    project_id: DataTypes.INTEGER,
    facility_group_id: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'project_facility_groups',
    modelName: 'ProjectFacilityGroup',
    underscored: true
  });
  return ProjectFacilityGroup;
};