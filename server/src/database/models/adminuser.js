'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminUser.init({
    email: DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    reset_password_token: DataTypes.STRING,
    reset_password_sent_at: DataTypes.DATE,
    remember_created_at: DataTypes.DATE,
    sign_in_count: DataTypes.INTEGER,
    current_sign_in_at: DataTypes.DATE,
    last_sign_in_at: DataTypes.DATE,
    current_sign_in_ip: DataTypes.STRING,
    last_sign_in_ip: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'admin_users',
    modelName: 'AdminUser',
    underscored: true
  });
  return AdminUser;
};