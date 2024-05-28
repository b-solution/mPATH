'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiskUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // this.belongsTo(models.User);
      // this.belongsTo(models.Risk)

    }
    accountable(){
      return this.user_type == "accountable"
    }
    responsible(){
      return this.user_type == "responsible"
    }
    consulted(){
      return this.user_type == "consulted"
    }
    informed(){
      return this.user_type == "informed"
    }
  }
  RiskUser.init({
    user_id: DataTypes.INTEGER,
    risk_id: DataTypes.INTEGER,
    timestamps: DataTypes.STRING,
    user_type: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    tableName: 'risk_users',
    modelName: 'RiskUser',
    underscored: true
  });
  return RiskUser;
};