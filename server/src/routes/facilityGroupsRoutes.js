const { index } = require("../controllers/FacilityGroupsController");

async function routes(fastify, option) {
  fastify.get("/api/v1/facility_groups", index);
}

module.exports = routes;
