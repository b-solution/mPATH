const { index } = require("../controllers/IssueTypesController");

async function routes(fastify, options) {
  fastify.get("/api/v1/filter_data/issue_types", index);
}

module.exports = routes;
