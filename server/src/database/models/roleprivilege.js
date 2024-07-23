"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePrivilege extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.Role, { foreignKey: "role_id" });
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
    static PROJECT_TASKS = "project_tasks";
    // This roles are used to access project related data e.g. tasks issues risks
    static PROJECT_ANALYTICS = "project_analytics";
    static PROJECT_TASKS = "project_tasks";
    static PROJECT_ISSUES = "project_issues";
    static PROJECT_RISKS = "project_risks";
    static PROJECT_LESSONS = "project_lessons";
    static PROJECT_NOTES = "project_notes";
    static PROJECT_EFFORTS = "project_efforts";

    static PROJECT_PRIVILEGES_ROLE_TYPES = [
      this.PROJECT_ANALYTICS,
      this.PROJECT_TASKS,
      this.PROJECT_ISSUES,
      this.PROJECT_RISKS,
      this.PROJECT_LESSONS,
      this.PROJECT_NOTES,
      this.PROJECT_EFFORTS,
    ];

    // # This roles are used to access contract related data e.g. task, issues risks
    static CONTRACT_ANALYTICS = "contract_analytics";
    static CONTRACT_TASKS = "contract_tasks";
    static CONTRACT_ISSUES = "contract_issues";
    static CONTRACT_RISKS = "contract_risks";
    static CONTRACT_LESSONS = "contract_lessons";
    static CONTRACT_NOTES = "contract_notes";

    static CONTRACT_PRIVILEGES_ROLE_TYPES = [
      this.CONTRACT_ANALYTICS,
      this.CONTRACT_TASKS,
      this.CONTRACT_ISSUES,
      this.CONTRACT_RISKS,
      this.CONTRACT_LESSONS,
      this.CONTRACT_NOTES,
    ];

    static PROGRAM_SETTING_GROUPS = "program_setting_groups";
    static PROGRAM_SETTING_USERS_ROLES = "program_setting_users_roles";
    static PROGRAM_SETTING_PROJECTS = "program_setting_projects";
    static PROGRAM_SETTING_CONTRACTS = "program_setting_contracts";

    static PROGRAM_SETTINGS_ROLE_TYPES = [
      this.PROGRAM_SETTING_GROUPS,
      this.PROGRAM_SETTING_USERS_ROLES,
      this.PROGRAM_SETTING_PROJECTS,
      this.PROGRAM_SETTING_CONTRACTS,
    ];

    static ALL_ROLE_TYPES = this.PROJECT_PRIVILEGES_ROLE_TYPES.concat(this.CONTRACT_PRIVILEGES_ROLE_TYPES).concat(this.PROGRAM_SETTINGS_ROLE_TYPES);
  }
  RolePrivilege.init(
    {
      role_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      role_user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      privilege: DataTypes.STRING,
      role_type: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "role_privileges",
      modelName: "RolePrivilege",
      underscored: true,
    }
  );
  return RolePrivilege;
};
