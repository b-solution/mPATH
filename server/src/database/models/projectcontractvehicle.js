"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectContractVehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.ContractVehicle);
      this.belongsTo(models.Project);
      // // this.belongsTo(models.ContractVehicleProject);
      // // this.belongsTo(models.ContractVehicleFacilityGroup);
      this.belongsTo(models.FacilityGroup, { foreignKey: "facility_group_id" });
      this.hasMany(models.Task, { foreignKey: "project_contract_vehicle_id" });
      this.hasMany(models.Issue, { foreignKey: "project_contract_vehicle_id" });
      this.hasMany(models.Risk, { foreignKey: "project_contract_vehicle_id" });
      this.hasMany(models.Lesson, { foreignKey: "project_contract_vehicle_id" });
      // this.hasMany(models.Note)
    }
    async toJSON() {
      const _response = this.get({ plain: true });
      let contract_vehicle = await this.getContractVehicle();
      console.log("contract_vehicle----", contract_vehicle);
      _response.contract_vehicle = await contract_vehicle.toJSON();

      let facility_group = await this.getFacilityGroup();
      if (facility_group) _response.facility_group = await facility_group.toJSON();
      console.log(_response);
      return _response;
    }
  }
  ProjectContractVehicle.init(
    {
      project_id: DataTypes.INTEGER,
      contract_vehicle_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      facility_group_id: DataTypes.INTEGER,
      progeress: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "project_contract_vehicles",
      modelName: "ProjectContractVehicle",
      underscored: true,
    }
  );
  return ProjectContractVehicle;
};
