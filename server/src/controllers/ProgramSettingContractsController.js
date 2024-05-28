const { db } = require("../database/models");
const qs = require('qs');
const {_} = require("lodash") 
const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')

async function index(req, res) {
  try {
    let params = qs.parse(req.query)

    const projectContracts = await db.ProjectContract.findAll({
      where: { project_id: params.project_id }
    });

    let contracts = [];
    await Promise.all(projectContracts.map(async (pc) => {
      const contract = await pc.toJSON();
      contracts.push(contract);
    }));

    return({ contracts, totalCount: contracts.length });
  } catch (error) {
    res.status(500)
    return({ error: "Error fetching contracts "+ error });
  }
}
async function update(req, res) {

  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    var projectContract = await db.ProjectContract.findOne({where: {id: params.id}})
    await projectContract.update(body.project_contract)


    return({ message: "Successfully updated contract" });

  } catch (error) {
    res.status(500)
    return({ error: "Error fetching contracts "+ error });
  }
}

async function destroy(req, res) {

  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    var projectContract = await db.ProjectContract.findOne({where: {id: params.id}})
    await projectContract.destroy()
    await db.RoleUser.destroy({where: {project_contract_id: projectContract.id}})
    return({ message: "Successfully deleted contract" });

  } catch (error) {
    res.status(500)
    return({ error: "Error fetching contracts "+ error });
  }

}
module.exports = {
  index,
  update,
  destroy
};