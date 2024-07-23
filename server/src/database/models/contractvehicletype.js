"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContractVehicleType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
    toJSON() {
      let _resource = this.get({ plain: true });
      return _resource;
    }
  }
  ContractVehicleType.init(
    {
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "contract_vehicle_types",
      modelName: "ContractVehicleType",
      underscored: true,
    }
  );
  return ContractVehicleType;
};
