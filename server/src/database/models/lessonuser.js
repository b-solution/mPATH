'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // this.belongsTo(models.User);
      // this.belongsTo(models.Lesson)

    }
  }
  LessonUser.init({
    user_id: DataTypes.INTEGER,
    lesson_id: DataTypes.INTEGER,
    user_type: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'lesson_users',
    modelName: 'LessonUser',
    underscored: true
  });
  return LessonUser;
};