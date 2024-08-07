const { db } = require("../database/models");
const qs = require("qs");
const { _ } = require("lodash");
const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

async function index(req, res) {
  try {
    let params = qs.parse(req.query);
    const projectContractVehicles = await db.ProjectContractVehicle.findAll({
      where: { project_id: params.project_id },
    });
    let contract_vehicles = [];
    await Promise.all(
      projectContractVehicles.map(async (pc) => {
        const contract_vehicle = await pc.toJSON();
        contract_vehicles.push(contract_vehicle);
      })
    );
    return { contract_vehicles, totalCount: contract_vehicles.length };
  } catch (error) {
    res.status(500);
    console.log(error);
    return { error: "Error fetching contract vehicles " + error };
  }
}
async function update(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    var projectContractVehicle = await db.ProjectContractVehicle.findOne({ where: { id: params.id } });
    await projectContractVehicle.update(body.project_contract_vehicle);

    return { message: "Successfully updated contract vehicle" };
  } catch (error) {
    res.status(500);
    return { error: "Error fetching contracts " + error };
  }
}

async function destroy(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    var projectContractVehicle = await db.ProjectContractVehicle.findOne({ where: { id: params.id } });
    await projectContractVehicle.destroy();
    await db.RoleUser.destroy({ where: { project_contract_vehicle_id: projectContractVehicle.id } });
    return { message: "Successfully deleted contract vehicle" };
  } catch (error) {
    res.status(500);
    return { error: "Error fetching contracts " + error };
  }
}

async function addContractVehicle(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body);
    printParams(req);

    var project = await db.Project.findOne({ where: { id: body.id } });
    body.project_id = project.id;
    if (!body.facility_group_id) {
      var facilityGroup = await project.getDefaultFacilityGroup();
      body.facility_group_id = facilityGroup.id;
    }
    delete body.id;
    var projectContractVehicle = db.ProjectContractVehicle.build(body);
    await projectContractVehicle.save();
    return { message: "Successfully added contract vehicle" };
  } catch (error) {
    res.status(500);
    console.log(error);
    return { error: "Error adding contract vehicle " + error };
  }
}

module.exports = {
  index,
  update,
  destroy,
  addContractVehicle,
};
