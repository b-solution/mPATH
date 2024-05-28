const { index } = require("../controllers/TaskStagesController");

async function routes(fastify, options) {
  fastify.get("/api/v1/task_stages", index);
}

module.exports = routes;
