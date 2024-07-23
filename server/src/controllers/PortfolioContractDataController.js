const { db } = require("../database/models");
const qs = require("qs");
const { _ } = require("lodash");
const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

async function index(req, res) {
  try {
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);
    let user = await getCurrentUser(req.headers["x-token"]);
    let authorizedData = await user.getAuthorizedData();
    console.log("****authorizedData", authorizedData);

    let authorizedContractIds = authorizedData.authorized_project_contract_ids;
    let projectContracts = await db.ProjectContract.findAll({ where: { id: authorizedContractIds } });
    let projectIds = compactAndUniq(
      _.map(projectContracts, function (pc) {
        return pc.project_id;
      })
    );
    let contractProjectDatum = await db.ContractProjectDatum.findAll({
      include: [
        { model: db.Project },
        { model: db.ProjectContract },
        {
          model: db.ContractVehicle,
          include: [
            { model: db.ContractVehicleType },
            { model: db.ContractSubCategory },
            { model: db.ContractProjectPocResource, include: [db.ContractProjectPoc] },
          ],
        },
        { model: db.ContractAwardTo },
        { model: db.ContractNaic },
        { model: db.ContractCustomer },
        { model: db.ContractAwardType },
        { model: db.ContractType },
        { model: db.ContractCurrentPop },
        { model: db.ContractPop },
        { model: db.ContractNumber },
        { model: db.User },
        { model: db.ContractProjectPocResource, include: [db.ContractProjectPoc] },
      ],
    });
    console.log("----", contractProjectDatum);
    //let sql_result = await db.ContractProjectDatum.getSQLResult({ user: user, authorizedContractIds: authorizedContractIds });

    let roleUserIds = compactAndUniq(
      _.map(contractProjectDatum, function (cpd) {
        return cpd.id;
      })
    );
    let roleUsers = await db.RoleUser.findAll({ where: { id: roleUserIds } });
    let roleUsersGroupBy = _.groupBy(roleUsers, function (rs) {
      return rs.project_contract_id;
    });

    var contractProjectData = await db.ContractProjectDatum.findAll();
    var responseData = [];
    for (var cpd of contractProjectData) {
      cpd.authorized_project_ids = projectIds;
      cpd.role_users = roleUsersGroupBy;
      responseData.push(cpd);
    }

    return { contract_project_data: responseData };
  } catch (error) {
    res.status(500);
    console.log(error);
    return { error: "Error fetching contracts " + error };
  }
}

module.exports = {
  index,
};
