'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // this.hasMany(models.ProjectLessonStage);
      // this.belongsToMany(models.Project,{through: models.ProjectLessonStage, foreignKey: '', otherKey: '' })

    }
  }
  LessonStage.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'lesson_stages',
    modelName: 'LessonStage',
    underscored: true
  });
  return LessonStage;
};