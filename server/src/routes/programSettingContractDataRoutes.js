const { getContractData } = require("../controllers/ProgramSettingContractDataController");

async function routes(fastify, options) {
  fastify.get("/api/v1/program_settings/contract_data/get_contract_data", getContractData);
}

module.exports = routes;
