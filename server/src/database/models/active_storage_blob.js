'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class active_storage_blob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  active_storage_blob.init({
    record_id: DataTypes.BIGINT,
    record_type: DataTypes.STRING,
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    filename: DataTypes.STRING,
    content_type: DataTypes.STRING,
    metadata: DataTypes.TEXT,
    byte_size: DataTypes.BIGINT,
    checksum: DataTypes.STRING,
    service_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'active_storage_blob',
  });
  return active_storage_blob;
};