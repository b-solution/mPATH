"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Facility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.FacilityGroup, { foreignKey: "facility_group_id" });
      // this.belongsTo(models.User,{ as: 'Creator', foreignKey: 'creator_id' });
      this.hasMany(models.FacilityProject, { foreignKey: "facility_id", onDelete: "CASCADE" });
      this.belongsToMany(models.Project, { through: models.FacilityProject, foreignKey: "facility_id", otherKey: "" });
      this.belongsToMany(models.Task, { through: models.FacilityProject, foreignKey: "facility_id" });
      this.belongsToMany(models.TaskType, { through: models.Task, foreignKey: "facility_project_id", otherKey: "" });
      // // this.hasMany(models.Comment)
    }
    toJSON() {
      let h = { ...super.toJSON() };
      h["status"] = this.getStatus(h["status"]);
      return h;
    }
    getStatus(v) {
      return {
        0: "inactive",
        1: "active",
      }[v];
    }
  }
  Facility.init(
    {
      facility_name: DataTypes.STRING,
      region_name: DataTypes.INTEGER,
      address: DataTypes.STRING,
      point_of_contact: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
      facility_group_id: DataTypes.INTEGER,
      creator_id: DataTypes.INTEGER,
      lat: DataTypes.STRING,
      lng: DataTypes.STRING,
      status: DataTypes.INTEGER, //{"inactive"=>0, "active"=>1}
      country_code: DataTypes.STRING,
      project_facility_group_id: DataTypes.INTEGER,
      is_portfolio: DataTypes.BOOLEAN,
      project_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "facilities",
      modelName: "Facility",
      underscored: true,
    }
  );
  return Facility;
};
