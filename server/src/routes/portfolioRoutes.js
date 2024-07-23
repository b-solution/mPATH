const { tabCounts, issues, lessons, tasks, risks } = require("../controllers/portfolioController");

async function routes(fastify, options) {
  fastify.get("/api/v1/portfolio/tab_counts", tabCounts);
  fastify.get("/api/v1/portfolio/issues", issues);
  fastify.get("/api/v1/portfolio/lessons", lessons);
  fastify.get("/api/v1/portfolio/tasks", tasks);
  fastify.get("/api/v1/portfolio/risks", risks);
}

module.exports = routes;
