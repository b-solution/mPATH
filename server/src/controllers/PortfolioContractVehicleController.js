const { db } = require("../database/models");
const qs = require("qs");
const { _ } = require("lodash");
const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
const { Op } = require("sequelize");

async function index(req, res) {
  try {
    const user = await getCurrentUser(req.headers["x-token"]);
    const authorized_data = await user.getAuthorizedData();
    const authorized_contract_vehicle_ids = authorized_data.authorized_project_contract_vehicle_ids;
    const projectContractVehicle = await db.ProjectContractVehicle.findAll({
      where: {
        id: authorized_contract_vehicle_ids,
      },
      attributes: ["project_id"],
    });
    const project_ids = projectContractVehicle.map((pcv) => pcv.project_id);
    const roleUsers = await db.RoleUser.findAll({
      where: {
        user_id: user.id,
        project_contract_vehicle_id: {
          [Op.in]: authorized_contract_vehicle_ids,
        },
      },
    });
    let role_ids = _.compact(
      _.uniq(
        _.map(roleUsers, function (f) {
          return f.role_id;
        })
      )
    );
    const rolePrivilages = await db.RolePrivilege.findAll({
      where: {
        role_id: role_ids,
        privilege: {
          [Op.regexp]: "^[RWD]",
        },
        role_type: "contract_tasks",
      },
    });
    let rolePriviligeRoleIds = _.compact(
      _.uniq(
        _.map(rolePrivilages, function (f) {
          return f.role_id;
        })
      )
    );
    let roleUsers2 = await db.RoleUser.findAll({
      attributes: ["project_contract_vehicle_id", "user_id", "role_id"],
      where: { user_id: user.id, role_id: rolePriviligeRoleIds },
      group: ["project_contract_vehicle_id"],
    });
    const getContractVehicles = await db.ContractVehicle.findAll({
      include: [
        {
          model: db.Project,
        },
        {
          model: db.ProjectContractVehicle,
        },
        {
          model: db.ContractVehicleType,
        },
        {
          model: db.ContractSubCategory,
        },
        {
          model: db.ContractNumber,
        },
        {
          model: db.ContractAgency,
        },
        {
          model: db.ContractProjectPocResource,
          include: [{ model: db.ContractProjectPoc }],
        },
      ],
    });
    console.log("ok", getContractVehicles);
    let contract_vehicles = await Promise.all(
      getContractVehicles.map(async (cv) => {
        let cvJson = await cv.toJSON();
        cvJson.project_ids = project_ids;
        cvJson.roleUsers2 = roleUsers2;
        return cvJson;
      })
    );
    console.log("ok", contract_vehicles);

    return { contract_vehicles };
  } catch (error) {
    console.log(error);
    res.status(500);
    return { error: "Error fetching contract vehicles " + error };
  }
}
async function create(req, res) {
  try {
    const body = qs.parse(req.body);
    const user = await getCurrentUser(req.headers["x-token"]);
    const contractVehicle = await db.ContractVehicle.createOrUpdateContractVehicle(body, user);
    return { contract_vehicle: await contractVehicle.toJSON() };
  } catch (error) {
    console.log(error);
  }
}
async function update(req, res) {
  try {
    const body = qs.parse(req.body);
    const user = await getCurrentUser(req.headers["x-token"]);
    const contractVehicle = await db.ContractVehicle.createOrUpdateContractVehicle(body, user);
    return { contract_vehicle: await contractVehicle.toJSON() };
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  index,
  create,
  update,
};
