const { db } = require("../database/models");

const index = async (req, res) => {
  try {
    const contract_project_pocs = await db.ContractProjectPoc.findAll({ attributes: ["id", "name"] }).then((ContractProjectPocs) =>
      ContractProjectPocs.map((cp) => cp.toJSON())
    );
    return { contract_project_pocs: contract_project_pocs };
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  index,
};
