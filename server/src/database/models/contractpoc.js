"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContractPoc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      let _resource = this.get({ plain: true });
      return _resource;
    }
  }
  ContractPoc.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "contract_pocs",
      modelName: "ContractPoc",
      underscored: true,
    }
  );
  return ContractPoc;
};
