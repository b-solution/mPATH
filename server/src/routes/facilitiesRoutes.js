const { show, index, create, destroy } = require("../controllers/FacilitiesController");
const { getCurrentUser } = require("../utils/helpers");
const { db } = require("../database/models");
const { update } = require("lodash");
async function checkFacilitiesPermission(req, res) {
  let controllerAction = req.routeOptions.handler.name.split(" ")[1];
  console.log("controllerAction----", controllerAction);
  if (["move_to_program", "duplicate_to_program"]) {
  }
}

async function routes(fastify, options) {
  fastify.addHook("preHandler", checkFacilitiesPermission);
  fastify.get("/api/v1/facilities/:id", show);
  fastify.get("/api/v1/facilities", index);
  fastify.post("/api/v1/facilities", create);
  fastify.delete("/api/v1/facilities/:id", destroy);
  fastify.put("/api/v1/facilities/:id", update);
}

module.exports = routes;
