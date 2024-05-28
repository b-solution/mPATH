'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
//       // define association here
//       this.hasMany(models.ProjectStatus);
// this.belongsToMany(models.Project,{through: models.ProjectStatus, foreignKey: '', otherKey: '' })

    }
    static async notStarted(){
      const { db } = require("./index.js");
      const [status, created] = await db.Status.findOrCreate({
        where: {name: 'Not Started'},
        defaults: {
          color: "#000000"
        }
      });
      return status
    }
  }
  Status.init({
    name: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'statuses',
    modelName: 'Status',
    underscored: true
  });
  return Status;
};