'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContractSubCategory extends Model {
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
  ContractSubCategory.init({
    name: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'contract_sub_categories',
    modelName: 'ContractSubCategory',
    underscored: true
  });
  return ContractSubCategory;
};