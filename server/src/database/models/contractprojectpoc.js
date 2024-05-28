'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractProjectPoc extends Model {
    static CONTRACT_OFFICE_POC_TYPE = 'contract_office'
    static GOVERNMENT_POC_TYPE = 'government'
    static PROGRAM_MANAGER_POC_TYPE = 'program_manager'
  
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // this.belongsTo(models.User)

    }
  }
  ContractProjectPoc.init({
    name: DataTypes.STRING,
    poc_type: DataTypes.STRING,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    work_number: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    notes: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'contract_project_pocs',
    modelName: 'ContractProjectPoc',
    underscored: true
  });
  return ContractProjectPoc;
};