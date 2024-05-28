'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectIssueStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
//       // define association here
//       this.belongsTo(models.Project);
// this.belongsTo(models.IssueStage)

    }
  }
  ProjectIssueStage.init({
    project_id: DataTypes.INTEGER,
    issue_stage_id: DataTypes.INTEGER
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'project_issue_stages',
    modelName: 'ProjectIssueStage',
    underscored: true
  });
  return ProjectIssueStage;
};