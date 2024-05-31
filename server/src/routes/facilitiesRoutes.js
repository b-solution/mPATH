const { show, index, create, destroy, update, duplicate_to_program, move_to_program } = require("../controllers/FacilitiesController");
const { getCurrentUser } = require("../utils/helpers");
const { db } = require("../database/models");
async function checkFacilitiesPermission(req, res) {
  let controllerAction = req.routeOptions.handler.name.split(" ")[1];
  console.log("controllerAction----", controllerAction);
  if (req.body) {
    const { source_program_id, target_program_id } = req.body;
    console.log(source_program_id, target_program_id);
    const current_user = await getCurrentUser(req.headers["x-token"]);
    console.log("current_user:--", current_user);
    if (["move_to_program", "duplicate_to_program"]) {
      if (!source_program_id || !target_program_id || current_user.role !== 1) {
        return { error: "Access denied" };
      }
    }
  }
}

async function routes(fastify, options) {
  fastify.addHook("preHandler", checkFacilitiesPermission);
  fastify.get("/api/v1/facilities/:id", show);
  fastify.get("/api/v1/facilities", index);
  fastify.post("/api/v1/facilities", create);
  fastify.delete("/api/v1/facilities/:id", destroy);
  fastify.put("/api/v1/facilities/:id", update);
  fastify.post("/api/v1/facilities/duplicate_to_program", duplicate_to_program);
  fastify.post("/api/v1/facilities/move_to_program", move_to_program);
}

module.exports = routes;
