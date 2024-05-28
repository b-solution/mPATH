'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Lesson);
this.belongsTo(models.User)

    }
  }
  LessonDetail.init({
    finding: DataTypes.TEXT,
    recommendation: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    lesson_id: DataTypes.INTEGER,
    detail_type: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'lesson_details',
    modelName: 'LessonDetail',
    underscored: true
  });
  return LessonDetail;
};