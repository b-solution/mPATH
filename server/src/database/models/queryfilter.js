"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QueryFilter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //       // define association here
      //       this.belongsTo(models.Project);
      // this.belongsTo(models.User);
      this.belongsTo(models.FavoriteFilter, { foreignKey: "favorite_filter_id" });
    }
    toJSON() {
      const { getCurrentUser, printParams, compactAndUniq, serializeData, deserializeData } = require("../../utils/helpers.js");
      const { db } = require("./index.js");

      let h = { ...super.toJSON() };
      if (h["filter_value"]) {
        h["filter_value"] = JSON.parse(deserializeData(h["filter_value"]));
      }
      return h;
    }
  }
  QueryFilter.init(
    {
      name: DataTypes.STRING,
      filter_key: DataTypes.STRING,
      filter_value: DataTypes.TEXT,
      project_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      favorite_filter_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "query_filters",
      modelName: "QueryFilter",
      underscored: true,
    }
  );
  return QueryFilter;
};
