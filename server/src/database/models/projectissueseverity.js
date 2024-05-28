'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectIssueSeverity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
//       // define association here
//       this.belongsTo(models.Project);
// this.belongsTo(models.IssueSeverity)

    }
  }
  ProjectIssueSeverity.init({
    issue_severity_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'project_issue_severities',
    modelName: 'ProjectIssueSeverity',
    underscored: true
  });
  return ProjectIssueSeverity;
};