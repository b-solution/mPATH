const { index, show } = require("../controllers/projectContractController");

async function routes(fastify, options) {
  fastify.get("/api/v1/project_contracts", index);
  fastify.get(`/api/v1/project_contracts/:id`, show);
}

module.exports = routes;
