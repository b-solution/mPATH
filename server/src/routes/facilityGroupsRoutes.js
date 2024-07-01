const { index, create, update, destroy, bulkProjectUpdate, duplicateToPrograms, moveToProgram } = require("../controllers/FacilityGroupsController");
const { getCurrentUser } = require("../utils/helpers");
async function checkFacilityGroupsPermission(req, res) {
  console.log("testing");
  const { source_program_id, target_program_id } = req.body;
  const currentUser = await getCurrentUser(req.headers["x-token"]);
  if (!source_program_id || !target_program_id || currentUser.role !== 1) {
    return { error: "Access denied" };
  }
}
async function routes(fastify, option) {
  fastify.addHook("preHandler", checkFacilityGroupsPermission);
  fastify.get("/api/v1/facility_groups", index);
  fastify.post("/api/v1/facility_groups", create);
  fastify.put("/api/v1/facility_groups/:id", update);
  fastify.delete("/api/v1/facility_groups/:id", destroy);
  fastify.put("/api/v1/facility_groups/bulk_project_update", bulkProjectUpdate);
  fastify.post("/api/v1/facility_groups/duplicate_to_program", { preHandler: checkFacilityGroupsPermission }, duplicateToPrograms);
  fastify.post("/api/v1/facility_groups/move_to_program", { preHandler: checkFacilityGroupsPermission }, moveToProgram);
}

module.exports = routes;
