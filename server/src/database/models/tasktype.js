'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.Task,{ foreignKey: 'task_type_id' });
      // this.belongsToMany(models.FacilityProject,{through: models.Task, foreignKey: 'task_type_id', otherKey: '' });
      // this.belongsToMany(models.Facility,{through: models.FacilityProject, foreignKey: 'facility_id', otherKey: '' });
      // this.hasMany(models.ProjectTaskType);
      // this.belongsToMany(models.Project,{through: models.ProjectTaskType, foreignKey: '', otherKey: '' })

    }
  }
  TaskType.init({
    name: DataTypes.STRING,
    progress: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'task_types',
    modelName: 'TaskType',
    underscored: true
  });
  return TaskType;
};