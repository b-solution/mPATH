const { index } = require("../controllers/IssueStagesController");

async function routes(fastify, options) {
  fastify.get("/api/v1/issue_stages", index);
}

module.exports = routes;
