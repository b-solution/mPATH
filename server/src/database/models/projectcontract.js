"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectContract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.ContractProjectDatum);
      // this.belongsTo(models.Contract,{foreignKey: 'contract_id'});
      this.belongsTo(models.Project);
      //this.belongsTo(models.ContractProject);
      //this.belongsTo(models.ContractFacilityGroup);
      this.belongsTo(models.FacilityGroup);
      this.hasMany(models.Task, { foreignKey: "project_contract_id" });
      this.hasMany(models.Issue);
      // this.hasMany(models.Risk);
      // this.hasMany(models.Lesson);
      // this.hasMany(models.Note)
    }
    async toJSON() {
      // let _response = this.get({plain: true})
      let contractProjectData = await this.getContractProjectDatum({ plain: true });
      let _response = await contractProjectData.toJSON();
      // var contractProjectDataResponse = await contractProjectData.toJSON()

      // _response.contractProjectDataResponse = contractProjectDataResponse
      _response.project_contract_id = this.id;
      _response.facility_group = await this.getFacilityGroup();
      _response.facility_group_id = _response.facility_group.id;
      _response.contract_customer = await contractProjectData.getContractCustomer();
      let contract_vehicle = await contractProjectData.getContractVehicle();
      _response.contract_vehicle = await contract_vehicle.toJSON();
      _response.contract_award_to = await contractProjectData.getContractAwardTo();
      _response.contract_pop = await contractProjectData.getContractPop();
      _response.contract_naic = await contractProjectData.getContractNaic();
      _response.contract_award_type = await contractProjectData.getContractAwardType();
      _response.contract_type = await contractProjectData.getContractType();
      _response.contract_current_pop = await contractProjectData.getContractCurrentPop();
      _response.contract_number = await contractProjectData.getContractNumber();

      return _response;
    }
  }
  ProjectContract.init(
    {
      project_id: DataTypes.INTEGER,
      contract_project_datum_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      facility_group_id: DataTypes.INTEGER,
      progress: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "project_contracts",
      modelName: "ProjectContract",
      underscored: true,
    }
  );
  return ProjectContract;
};
