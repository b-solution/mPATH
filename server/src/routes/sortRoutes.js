const { update } = require("../controllers/SortsController");

async function routes(fastify, options) {
  fastify.post("/api/v1/sort-by", update);
}
module.exports = routes;
