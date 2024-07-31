const { db } = require("../database/models");
const { printParams, getCurrentUser } = require("../utils/helpers");
const qs = require("qs");
const { _ } = require("lodash");
const { Op } = require("sequelize");

async function add_users(req, res) {
  try {
    let responseHash = { roles: [] };
    let params = qs.parse(req.body);
    console.log("***** add users", params, req.params);
    let role = await db.Role.findOne({ where: { id: req.params.id } });
    let role_users = params["role_users"];
    for (var role_user of role_users) {
      var _ru = db.RoleUser.build({
        role_id: role.id,
        user_id: role_user.user_id,
        project_id: role_user.project_id,
        facility_project_id: role_user.facility_project_id,
        project_contract_id: role_user.project_contract_id,
        project_contract_vehicle_id: role_user.project_contract_vehicle_id,
      });
      await _ru.save();
    }
    return { message: "User added to role successfully!!", role: await role.toJSON({ page: "user_tab_role_assign", include: ["all"] }) };
  } catch (error) {
    res.status(422);
    return { message: "Error fetching roles " + error };
  }
}
async function index(req, res) {
  try {
    let responseHash = { roles: [] };
    let params = qs.parse(req.query);
    let project = await db.Project.findOne({ where: { id: params.project_id } });
    let projectUsers = await db.ProjectUser.findAll({ where: { project_id: params.project_id }, raw: true });
    let projectUserIds = _.uniq(
      _.map(projectUsers, function (u) {
        return u.user_id;
      })
    );

    let roleUsers = await db.RoleUser.findAll({ where: { project_id: project.id } });

    // const group_role_user_ids = _.groupBy(roleUsers, 'role_id')
    let role_ids = _.uniq(
      _.map(roleUsers, function (rs) {
        return rs.role_id;
      })
    );
    let roles = await db.Role.findAll({ where: { id: role_ids } });

    let group_role_user_ids = {};
    for (var role_user of roleUsers) {
      let role = _.find(roles, function (r) {
        return r.id == role_user.role_id;
      });
      role_user.role_name = role.name;
      if (group_role_user_ids[role_user.role_id]) {
        group_role_user_ids[role_user.role_id].push(role_user);
      } else {
        group_role_user_ids[role_user.role_id] = [role_user];
      }
    }

    for (const [role_id, roleUsers] of Object.entries(group_role_user_ids)) {
      var role = _.find(roles, function (r) {
        return r.id == parseInt(role_id);
      });
      let h = await role.toJSON({ include: "role_users" });
      // h.role_users = group_role_user_ids[h.id]
      responseHash.roles.push(h);
    }
    // response = response[0]['role_users']
    // response = group_role_user_ids
    let defaultRoles = await db.Role.getDefaultRoles({ role_ids: role_ids });

    for (var role of defaultRoles) {
      let h = await role.toJSON({ include: "role_users" });
      //TODO: use eager loading for performance
      // h.role_users = await role.getRoleUsers()
      role_ids.push(role.id);
      responseHash.roles.push(h);
    }

    const projectRoles = await db.Role.findAll({
      where: { id: { [Op.notIn]: role_ids }, project_id: project.id },
    });

    for (const role of projectRoles) {
      const h = await role.toJSON({ include: "role_users" });
      // h.role_users = await role.getRoleUsers()
      role_ids.push(role.id);
      responseHash.roles.push(h);
    }

    return responseHash;
  } catch (error) {
    res.status(500);
    return { message: "Error fetching roles " + error };
  }
}
async function show(req, res) {
  let body = qs.parse(req.body);
  let params = qs.parse(req.params);
  let query = qs.parse(req.query);
  role = await db.Role.findByPk(params.id);
  return { role: await role.toJSON() };
}
async function update_role_users(req, res) {
  try {
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    console.log("update-role-users:---", body);
    const project = await db.Project.fineOne({ where: { id: params.project_id } });
    const roleUsers = await db.RoleUser.findAll({
      where: { id: body.role_user_ids, project_id: project.id },
    });
    const role = await db.Role.fineOne({ where: { id: body.role_id } });

    if (!body.role_id || !role) {
      res.status(406);
      return { message: "Role id must be provided" };
    } else if (!body.role_user_ids || roleUsers.length === 0) {
      res.status(406);
      return { message: "User ids must be provided" };
    } else {
      // await db.RoleUser.update({ roleId: role.id }, { where: { id: body.role_user_ids } });
      res.status(200);
      return { message: "Successfully updated role users!!", role_users: roleUsers };
    }
  } catch (error) {
    res.status(500);
    return { error: error.message };
  }
}
async function remove_role(req, res) {
  try {
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);
    const project = await db.Project.findOne({
      where: { id: query.project_id },
    });

    const roles = await db.Role.findAll({
      where: { id: body.role_id },
    });
    let role_ids = _.map(roles, function (r) {
      return r.id;
    });
    const conditions = {
      project_id: project.id,
      role_id: role_ids,
    };

    if (body.user_id) {
      conditions.user_id = body.user_id;
    }

    if (body.facility_project_id) {
      conditions.facility_project_id = body.facility_project_id;
    }

    if (body.project_contract_id) {
      conditions.project_contract_id = body.project_contract_id;
    }

    if (body.project_contract_vehicle_id) {
      conditions.project_contract_vehicle_id = body.project_contract_vehicle_id;
    }

    if (!conditions.role_id || conditions.role_id.length < 1) {
      res.status(406).return({ message: "Invalid parameter: Role must be provided." });
    } else if (!conditions.user_id) {
      res.status(406);
      return { message: "Invalid parameter: User id must be provided." };
    }

    const roleUsers = await db.RoleUser.findAll({ where: conditions });
    const programAdminRole = await db.Role.findOne({ where: { name: "Program Admin" } });
    const programAdminUserIds = await project.getProgramAdminIds();
    const errors = [];

    for (const roleUser of roleUsers) {
      if (programAdminRole && programAdminRole.id === roleUser.role_id && programAdminUserIds.length < 2) {
        errors.push("Program must have at least one program admin user.");
      } else {
        if (!(await roleUser.destroy())) {
          errors.push("Error removing role user " + roleUser.id);
        }
      }
    }

    if (errors.length > 0) {
      res.status(406);
      return { errors: errors.join(", ") };
    } else {
      res.status(200);
      return { message: "Successfully removed role!!" };
    }
  } catch (error) {
    res.status(500);
    return { error: "Error " + error };
  }
}
async function update(req, res) {
  try {
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    console.log("update:---", body);
    printParams(req);
    let user = await getCurrentUser(req.headers["x-token"]);
    let role;
    if (params.id) {
      role = await db.Role.findByPk(params.id);
    } else {
      role = db.Role.build();
    }

    role.name = body.role.name;
    role.is_portfolio = false;
    role.project_id = body.role.project_id;
    role.user_id = user.id;
    role.is_default = false;
    role.type_of = body.role.type_of;
    await role.save();
    const paramsRolePrivileges = body.role.role_privileges || [];
    let role_privileges = await role.getRolePrivileges();
    console.log("**** rolePrivileges", paramsRolePrivileges);
    if (paramsRolePrivileges.length > 0) {
      let rps = [];
      for (var role_privilege of paramsRolePrivileges) {
        if (role_privilege.id) {
          let r = _.find(role_privileges, function (_rp) {
            if (_rp.id == parseInt(role_privilege.id)) {
              return _rp;
            }
          });
          if (r) {
            r.setAttributes(role_privilege);
            await r.save();
          }
        }
      }
      // if(rps.length > 0){
      //   await db.RolePrivilege.bulkCreate(rps,{updateOnDuplicate: ['id']})
      // }
    }

    return { message: "Successfully created Role." };
  } catch (error) {
    throw new Error(`Error creating or updating role: ${error}`);
  }
}
async function destroy(req, res) {}
async function create(req, res) {
  console.log("Request: ", req.body);
  try {
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams({ body, params, query });
    let user = await getCurrentUser(req.headers["x-token"]);
    console.log("User: ", body);
    let role;
    if (params.id) {
      role = await db.Role.findByPk(params.id);
    } else {
      role = db.Role.build();
    }
    role.name = body.role.name;
    role.is_portfolio = false;
    role.project_id = body.role.project_id;
    role.user_id = user.id;
    role.is_default = false;
    role.type_of = body.role.type_of;
    await role.save();
    const rolePrivileges = body.role.role_privileges || [];
    if (rolePrivileges.length > 0) {
      let rps = [];
      for (var rp of rolePrivileges) {
        rp.role_id = role.id;
        rps.push(rp);
      }
      if (rps.length > 0) {
        await db.RolePrivilege.bulkCreate(rps);
      }
    }

    return { message: "Successfully created Role." };
  } catch (error) {
    throw new Error(`Error creating or updating role: ${error}`);
  }
}

module.exports = {
  index,
  add_users,
  update_role_users,
  remove_role,
  update,
  destroy,
  create,
  show,
};
