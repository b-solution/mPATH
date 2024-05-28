// const { Router } = require("express");
const { 
  index,
  program_lessons,
  show,
  update,
  create,
  count
} = require("../controllers/LessonsController");

async function checkLessonPermission(req, res) {
  let action = null;

  const { db } = require("../database/models");
  const qs = require('qs');
  const {_} = require("lodash") 
  const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')

  let body = qs.parse(req.body)
  let params = qs.parse(req.params)
  let query = qs.parse(req.query)
  printParams(req)

  let controllerAction = req.routeOptions.handler.name.split(" ")[1]

  if (["index", "show"].includes(controllerAction)) {
      action = "read";
  } else if (["create", "update", "create_duplicate", "create_bulk_duplicate", "batch_update"].includes(controllerAction)) {
      action = "write";
  } else if (["destroy"].includes(controllerAction)) {
      action = "delete";
  }

  let user = await getCurrentUser(req.headers['x-token'])
  let _authParams = {}
  if (params.project_contract_id) {
    _authParams = { action: action, resource: 'lessons', project_contract: params.project_contract_id }
  } else if (params.project_contract_vehicle_id) {
    _authParams = { action: action, resource: 'risks', project_contract_vehicle: params.project_contract_vehicle_id }
  } else {
    _authParams = { action: action, resource: 'lessons', program: params.program_id, project: params.project_id }
  }
  let authResult = await user.hasPermissionByRole(_authParams)

  if(!authResult){
    res.status(403)
    // return({ error: "Access Denied" });
    throw new Error("Access Denied")
  }

}



async function routes (fastify, options) {
  // fastify.use(checkLessonPermission);
  // fastify.addHook('preHandler', checkLessonPermission)
  fastify.get("/api/v1/programs/:program_id/lessons", program_lessons);
  fastify.get("/api/v1/programs/:program_id/projects/:project_id/lessons", index);
  fastify.get("/api/v1/project_contracts/:project_contract_id/lessons", index);
  fastify.get("/api/v1/project_contract_vehicles/:project_contract_vehicle_id/lessons", index);

  fastify.get("/api/v1/programs/:program_id/projects/:project_id/lessons/:id", {preHandler: checkLessonPermission}, show);
  fastify.post("/api/v1/programs/:program_id/projects/:project_id/lessons", create);
  fastify.patch("/api/v1/programs/:program_id/projects/:project_id/lessons/:id", update);
  fastify.get("/api/v1/programs/:program_id/lessons/count", count);
}
module.exports = routes