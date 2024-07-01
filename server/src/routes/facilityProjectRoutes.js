const { index, show, update } = require("../controllers/FacilityProjectsController");
const { userTimeZone } = require("../controllers/applicationController");

async function routes(fastify, options) {
  fastify.get("/api/v1/programs/:project_id/projects/:facility_id/facility_projects", { preHandler: userTimeZone }, index);
  fastify.get("/api/v1/programs/:project_id/projects/:facility_id/facility_projects/:id", show);
  fastify.put("/api/v1/programs/:project_id/projects/:facility_id/facility_projects/:id", update);
}

module.exports = routes;
