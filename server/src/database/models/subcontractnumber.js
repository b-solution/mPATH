"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubcontractNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.Contract);
    }
    toJSON() {
      let _resource = this.get({ plain: true });
      return _resource;
    }
  }
  SubcontractNumber.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "subcontract_numbers",
      modelName: "SubcontractNumber",
      underscored: true,
    }
  );
  return SubcontractNumber;
};
