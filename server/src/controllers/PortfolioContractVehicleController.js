const { db } = require("../database/models");
const qs = require('qs');
const {_} = require("lodash") 
const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')

async function index(req, res) {
  try {
    let params = qs.parse(req.query)

    const projectContractVehicles = await db.ProjectContractVehicle.findAll({
      where: { project_id: params.project_id }
    });

    let contract_vehicles = [];
    await Promise.all(projectContractVehicles.map(async (pc) => {
      const contract_vehicle = await pc.toJSON();
      contract_vehicles.push(contract_vehicle);
    }));

    return({ contract_vehicles, totalCount: contract_vehicles.length });
  } catch (error) {
    res.status(500)
    return({ error: "Error fetching contract vehicles "+ error });
  }
}

module.exports = {
  index
};