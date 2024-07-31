const { db } = require("../database/models/");
const qs = require("qs");
const { _ } = require("lodash");
const { cryptPassword, getCurrentUser } = require("../utils/helpers");

// Function for retrieving user details
const get_user_privileges = async (req, res) => {
  try {
    const { db } = require("../database/models/");

    let query = qs.parse(req.query);
    let params = qs.parse(req.params);
    let body = qs.parse(req.body);
    console.log("****body", qs.parse(req.body));
    console.log("****params", params);
    var user = await getCurrentUser(req.headers["x-token"]);
    var programId = query.program_id;
    console.log("Program Id: ", programId);
    var adminRole = await db.Role.programAdminUserRole();
    console.log("Admin Role: ", adminRole);
    var projectPrivilegesHashByRole = await user.projectPrivilegesHashByRole();
    console.log("projectPrivilegesHashByRole: ", projectPrivilegesHashByRole);
    var contractPrivilegesHashByRole = await user.privilegesHashByRole({ programIds: [programId], resourceType: "contract" });
    console.log("contractPrivilegesHashByRole: ", contractPrivilegesHashByRole);
    var contractVehiclePrivilegesHashByRole = await user.privilegesHashByRole({ programIds: [programId], resourceType: "contract_vehicle" });
    console.log("contractVehiclePrivilegesHashByRole: ", contractVehiclePrivilegesHashByRole);
    var facilityPrivilegesHashByRole = await user.facilityPrivilegesHashByRole({ programIds: [programId] });
    console.log("facilityPrivilegesHashByRole: ", facilityPrivilegesHashByRole);
    var programSettingsPrivilegesHashByRole = await user.programSettingsPrivilegesHashByRole({ programIds: [programId] });
    console.log("programSettingsPrivilegesHashByRole: ", programSettingsPrivilegesHashByRole);
    var responseHash = {
      program_admin_role: adminRole.dataValues,
      program_privilegs_roles: projectPrivilegesHashByRole,
      contract_privilegs_roles: contractPrivilegesHashByRole,
      contract_vehicle_privileges_roles: contractVehiclePrivilegesHashByRole,
      project_privilegs_roles: facilityPrivilegesHashByRole,
      program_settings_privileges_roles: programSettingsPrivilegesHashByRole,
    };

    return responseHash;
  } catch (error) {
    res.code(500);
    return { error: "Error fetching data" + error.stack };
  }
};
async function create(req, res) {
  try {
    let body = qs.parse(req.body);
    let user = await db.User.build();
    let hashedPassword = await cryptPassword("changeme");
    user.encrypted_password = hashedPassword;
    user.setAttributes(body.user);
    if (await user.save()) {
      res.status(200);
      return { msg: user.id };
    } else {
      res.status(406);
      return { msg: "Error creating user" };
    }
  } catch (error) {
    res.status(500);
    return { error: "Exception creating user " + error };
  }
}
async function update(req, res) {
  try {
    let params = qs.parse(req.params);
    let body = qs.parse(req.body);
    console.log("Request--", body);
    let user = await db.User.findOne({ where: { id: params.id } });
    user.setAttributes(body.user);
    if (await user.save()) {
      res.status(200);
      return { msg: "User updated successfully!" };
    } else {
      res.status(406);
      return { msg: "Error updating user" };
    }
  } catch (error) {
    res.status(500);
    return { error: "Exception updating user " + error };
  }
}
const remove_from_program = async (req, res) => {
  try {
    let params = qs.parse(req.body);
    let user = await db.User.findOne({ where: { id: params.user_id } });
    let program = await db.Project.findOne({ where: { id: params.program_id } });
    let programAdminRole = await db.Role.programAdminUserRole({});
    let programAdminUsers = await program.getProgramAdmins();
    let role_id = programAdminRole.id;
    var program_admin_user_ids = _.compact(
      _.map(programAdminUsers, function (pu) {
        return pu.id;
      })
    );
    if (_.compact(_.without(program_admin_user_ids, [user.id])).length < 1) {
      res.status(406);
      return { msg: "There must be at least 1 program admin exists in program! Please retry." };
    } else {
      await db.ProjectUser.destroy({ where: { project_id: params.program_id, user_id: params.user_id } });
      await db.RoleUser.destroy({ where: { project_id: params.program_id, user_id: params.user_id } });
      return { msg: "Users are removed from program successfully!" };
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    return { error: "Error removing user from program " + error };
  }
};
async function add_to_program(req, res) {
  try {
    let params = qs.parse(req.body);
    console.log("Request-Body: ", params);
    // let user = await db.User.findAll({ where: { id: params.user_ids } });
    let program = await db.Project.findOne({ where: { id: params.program_id } });
    console.log("Program: ", program);
    let project_users = await db.ProjectUser.findAll({ where: { project_id: params.program_id } });
    console.log("project_users: ", project_users);
    let p_user_ids = _.uniq(
      _.map(project_users, function (pu) {
        return pu.user_id;
      })
    );
    let new_project_users = [];

    for (var uid of params.user_ids) {
      if (!p_user_ids.includes(parseInt(uid))) {
        new_project_users.push({ user_id: uid, project_id: program.id });
      }
    }

    if (new_project_users.length > 0) {
      await db.ProjectUser.bulkCreate(new_project_users);
    }

    return { msg: "Users are added to program successfully!" };
  } catch (error) {
    res.status(500);
    return { error: "Error adding user to program " + error };
  }
}

async function index(req, res) {
  try {
    let responseHash = { users: [] };

    let params = qs.parse(req.query);
    let users = [];
    if (params.all == "true") {
      users = await db.User.findAll({ where: { status: 1 } });
    } else if (params.program_id) {
      console.log("Id cond");
      let project_users = await db.ProjectUser.findAll({ where: { project_id: params.program_id } });
      let user_ids = _.uniq(
        _.map(project_users, function (pu) {
          return pu.user_id;
        })
      );
      users = await db.User.findAll({ where: { status: 1, id: user_ids } });
    }

    for (var user of users) {
      responseHash.users.push(user.toJSON());
    }
    console.log("Response Hash: ", responseHash);
    return responseHash.users;
  } catch (error) {
    res.status(500);
    return { error: "Error fetching facility groups " + error };
  }
}

module.exports = {
  get_user_privileges,
  add_to_program,
  remove_from_program,
  index,
  update,
  create,
};
