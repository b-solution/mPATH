const { index } = require("../controllers/contractProjectPocsController");

async function routes(fastify, options) {
  fastify.get("/api/v1/portfolio/contract_project_pocs", index);
}

module.exports = routes;
