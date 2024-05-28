'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPreference.init({
    navigation_menu: DataTypes.STRING,
    sub_navigation_menu: DataTypes.STRING,
    program_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    project_group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserPreference',
  });
  return UserPreference;
};