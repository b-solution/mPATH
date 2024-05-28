"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // this.belongsTo(models.ContractType);
      // this.belongsTo(models.ContractStatus);
      // this.belongsTo(models.ContractCustomer);
      // this.belongsTo(models.ContractVehicle);
      // this.belongsTo(models.ContractVehicleNumber);
      // this.belongsTo(models.ContractNumber);
      // this.belongsTo(models.SubcontractNumber);
      // this.belongsTo(models.ContractPrime);
      // this.belongsTo(models.ContractCurrentPop);
      // this.belongsTo(models.ContractClassification);
      // this.belongsTo(models.ContractClientType);
      // this.belongsTo(models.ContractCategory);
      // this.belongsTo(models.FacilityGroup);
      // this.belongsTo(models.Project);
      // // this.belongsTo(models.ContractProject);
      // // this.belongsTo(models.ContractFacilityGroup);
      // this.hasMany(models.Task);
      this.hasMany(models.Issue);
      // this.hasMany(models.Risk);
      // this.hasMany(models.Lesson);
      // this.hasMany(models.Note)
    }
  }
  Contract.init(
    {
      contract_type_id: DataTypes.INTEGER,
      project_code: DataTypes.INTEGER,
      nickname: DataTypes.STRING,
      contract_status_id: DataTypes.INTEGER,
      contract_customer_id: DataTypes.INTEGER,
      contract_vehicle_id: DataTypes.INTEGER,
      contract_vehicle_number_id: DataTypes.INTEGER,
      contract_number_id: DataTypes.INTEGER,
      contract_classification_id: DataTypes.INTEGER,
      subcontract_number_id: DataTypes.INTEGER,
      contract_prime_id: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      contract_current_pop_id: DataTypes.INTEGER,
      current_pop_start_time: DataTypes.DATE,
      current_pop_end_time: DataTypes.DATE,
      days_remaining: DataTypes.INTEGER,
      total_contract_value: DataTypes.FLOAT,
      current_pop_value: DataTypes.FLOAT,
      current_pop_funded: DataTypes.FLOAT,
      total_contract_funded: DataTypes.FLOAT,
      user_id: DataTypes.INTEGER,
      facility_group_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      total_subcontracts: DataTypes.INTEGER,
      contract_category_id: DataTypes.INTEGER,
      contract_client_type_id: DataTypes.INTEGER,
      remarks: DataTypes.TEXT,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "contracts",
      modelName: "Contract",
      underscored: true,
    }
  );
  return Contract;
};
