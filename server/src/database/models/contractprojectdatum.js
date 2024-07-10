"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContractProjectDatum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ProjectContract);
      this.belongsTo(models.ContractCustomer, { foreignKey: "contract_customer_id" });
      this.belongsTo(models.ContractVehicle, { foreignKey: "contract_vehicle_id" });
      this.belongsTo(models.ContractAwardTo, { foreignKey: "contract_award_type_id" });
      this.belongsTo(models.ContractPop, { foreignKey: "contract_pop_id" });
      this.belongsTo(models.ContractNaic, { foreignKey: "contract_naic_id" });
      this.belongsTo(models.ContractAwardType, { foreignKey: "contract_award_type_id" });
      this.belongsTo(models.ContractType, { foreignKey: "contract_type_id" });
      this.belongsTo(models.ContractCurrentPop, { foreignKey: "contract_current_pop_id" });
      this.belongsTo(models.ContractNumber, { foreignKey: "contract_number_id" });
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  ContractProjectDatum.init(
    {
      charge_code: DataTypes.STRING,
      name: DataTypes.STRING,
      contract_customer_id: DataTypes.INTEGER,
      contract_award_to_id: DataTypes.INTEGER,
      contract_type_id: DataTypes.INTEGER,
      prime_or_sub: DataTypes.STRING,
      contract_start_date: DataTypes.DATE,
      contract_end_date: DataTypes.DATE,
      total_contract_value: DataTypes.DECIMAL,
      contract_pop_id: DataTypes.INTEGER,
      contract_current_pop_id: DataTypes.INTEGER,
      contract_current_pop_start_date: DataTypes.DATE,
      contract_current_pop_end_date: DataTypes.DATE,
      total_founded_value: DataTypes.DECIMAL,
      billings_to_date: DataTypes.DECIMAL,
      comments: DataTypes.STRING,
      contract_naic_id: DataTypes.INTEGER,
      contract_vehicle_id: DataTypes.INTEGER,
      contract_award_type_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      number: DataTypes.STRING,
      co_contract_poc_id: DataTypes.INTEGER,
      gov_contract_poc_id: DataTypes.INTEGER,
      pm_contract_poc_id: DataTypes.INTEGER,
      contract_number_id: DataTypes.INTEGER,
      notes: DataTypes.TEXT,
      ignore_expired: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ContractProjectDatum",
      tableName: "contract_project_data",
    }
  );
  return ContractProjectDatum;
};
