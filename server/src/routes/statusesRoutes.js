const { index } = require("../controllers/StatusesController");

async function routes(fastify, options) {
  fastify.get("/api/v1/statuses", index);
}

module.exports = routes;
