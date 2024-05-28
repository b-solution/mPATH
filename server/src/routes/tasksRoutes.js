// const { Router } = require("express");
const { update, show, create, createDuplicate, destroy, createBulkDuplicate } = require("../controllers/TasksController");
async function checkTaskPermission(req, res) {
  let action = null;

  const { db } = require("../database/models");
  const qs = require("qs");
  const { _ } = require("lodash");
  const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

  let body = qs.parse(req.body);
  let params = qs.parse(req.params);
  // console.log("Params-Testing: ", params);
  let query = qs.parse(req.query);
  console.log("query-Testing: ", query);
  printParams(req);

  let controllerAction = req.routeOptions.handler.name.split(" ")[1];

  if (["index", "show"].includes(controllerAction)) {
    action = "read";
  } else if (["create", "update", "createDuplicate", "createBulkDuplicate", "batch_update"].includes(controllerAction)) {
    action = "write";
  } else if (["destroy"].includes(controllerAction)) {
    action = "delete";
  }
  let user = null;
  user = await getCurrentUser(req.headers["x-token"]);
  console.log("Current User: ", user);
  let _authParams = {};
  if (params.project_contract_id) {
    _authParams = { action: action, resource: "tasks", project_contract: params.project_contract_id };
  } else if (params.project_contract_vehicle_id) {
    _authParams = { action: action, resource: "tasks", project_contract_vehicle: params.project_contract_vehicle_id };
  } else {
    console.log("Else Part");
    _authParams = { action: action, resource: "tasks", program: params.program_id, project: params.project_id };
  }
  console.log("Auth-Params: ", _authParams);
  let authResult = await user.hasPermissionByRole(_authParams);
  console.log("authResult: ", authResult);
  if (!authResult) {
    res.status(403);
    // return({ error: "Access Denied" });
    throw new Error("Access Denied");
  }
}

async function routes(fastify, options) {
  fastify.addHook("preHandler", checkTaskPermission);
  fastify.post("/api/v1/programs/:program_id/projects/:project_id/tasks", create);
  fastify.post("/api/v1/programs/:program_id/projects/:project_id/tasks/:id/create_duplicate", createDuplicate);
  fastify.post("/api/v1/programs/:program_id/projects/:project_id/tasks/:id/create_bulk_duplicate", createBulkDuplicate);
  fastify.put("/api/v1/programs/:program_id/projects/:project_id/tasks/:id", update);
  fastify.get("/api/v1/programs/:program_id/projects/:project_id/tasks/:id", show);
  fastify.delete("/api/v1/programs/:program_id/projects/:project_id/tasks/:id", destroy);
}
module.exports = routes;
