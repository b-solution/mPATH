const { index } = require("../controllers/TaskTypesController");

async function routes(fastify, options) {
  fastify.get("/api/v1/task_types", index);
}

module.exports = routes;
