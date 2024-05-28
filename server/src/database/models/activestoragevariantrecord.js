'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActiveStorageVariantRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ActiveStorageVariantRecord.init({
    name: DataTypes.STRING,
    record_type: DataTypes.STRING,
    record_id: DataTypes.BIGINT,
    blob_id: DataTypes.BIGINT,
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'active_storage_attachments',
    modelName: 'ActiveStorageVariantRecord',
    underscored: true
  });
  return ActiveStorageVariantRecord;
};