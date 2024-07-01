// const { Router } = require("express");
const { update, show, create, index } = require("../controllers/NotesController");

async function checkNotePermission(req, res) {
  let action = null;

  const { db } = require("../database/models");
  const qs = require("qs");
  const { _ } = require("lodash");
  const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

  let body = qs.parse(req.body);
  let params = qs.parse(req.params);
  let query = qs.parse(req.query);
  printParams(req);

  let controllerAction = req.routeOptions.handler.name.split(" ")[1];

  if (["index", "show"].includes(controllerAction)) {
    action = "read";
  } else if (["create", "update"].includes(controllerAction)) {
    action = "write";
  } else if (["destroy"].includes(controllerAction)) {
    action = "delete";
  }
  let user = await getCurrentUser(req.headers["x-token"]);
  let _authParams = {};
  if (params.project_contract_id) {
    _authParams = { action: action, resource: "notes", project_contract: params.project_contract_id };
  } else if (params.project_contract_vehicle_id) {
    _authParams = { action: action, resource: "notes", project_contract_vehicle: params.project_contract_vehicle_id };
  } else {
    _authParams = { action: action, resource: "notes", program: params.program_id, project: params.project_id };
  }
  let authResult = await user.hasPermissionByRole(_authParams);

  if (!authResult) {
    res.status(403);
    // return({ error: "Access Denied" });
    throw new Error("Access Denied");
  }
}

async function routes(fastify, options) {
  fastify.addHook("preHandler", checkNotePermission);
  fastify.get("/api/v1/programs/:program_id/projects/:project_id/notes", index);
  fastify.get("/api/v1/project_contracts/:project_contract_id/notes", index);
  fastify.get("/api/v1/project_contract_vehicles/:project_contract_vehicle_id/notes", index);
  fastify.post("/api/v1/programs/:program_id/projects/:project_id/notes", create);
  fastify.put("/api/v1/programs/:program_id/projects/:project_id/notes/:id", update);
  fastify.put("/api/v1/project_contracts/:project_contract_id/notes/:id", update);
  fastify.put("/api/v1/project_contract_vehicles/:project_contract_vehicle_id/notes/:id", update);
  fastify.get("/api/v1/programs/:program_id/projects/:project_id/notes/:id", show);
}
module.exports = routes;
