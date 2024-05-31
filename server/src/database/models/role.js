"use strict";
const { Op, Model } = require("sequelize");
const { _ } = require("lodash");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User);
      // this.belongsTo(models.Project);
      this.hasMany(models.RoleUser, { foreignKey: "role_id" });
      this.belongsToMany(models.User, { through: models.RoleUser, foreignKey: "", otherKey: "" });
      this.hasMany(models.RolePrivilege);
    }
    async toJSON(options) {
      const { db } = require("./index.js");

      var _response = this.get({ plain: true });
      _response.role_privileges = await this.getRolePrivileges();
      if (options) {
        if (options["page"] == "user_tab_role_assign") {
          _response.facility_projects = [];
          _response.contracts = [];
        }
        if (options["include"] == "all" || options["include"] == "role_users") {
          let role_users = await this.getRoleUsers();
          let user_ids = _.map(role_users, function (rs) {
            return rs.user_id;
          });
          let users = await db.User.findAll({ where: { id: user_ids } });
          _response.role_users = [];
          for (var rs of role_users) {
            var _v = rs.toJSON();
            _v.role_name = this.name;
            var u = _.find(users, function (usr) {
              return usr.id == rs.user_id;
            });
            _v.user_full_name = u.getFullName();
            _response.role_users.push(_v);
          }
        }
      }
      return _response;
    }
    static async programAdminUserRole() {
      const { db } = require("./index.js");
      var r = await db.Role.findOne({ where: { name: "program-admin" } });
      console.log("Role-Admin: ", r);
      return r;
    }

    static async getDefaultRoles(options) {
      const { db } = require("./index.js");

      let defaultRoles = await db.Role.findAll({
        where: { id: { [Op.notIn]: options.role_ids }, is_default: true },
      });
      return defaultRoles;
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      project_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      is_portfolio: DataTypes.BOOLEAN,
      is_default: DataTypes.BOOLEAN,
      type_of: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "roles",
      modelName: "Role",
      underscored: true,
    }
  );
  return Role;
};
