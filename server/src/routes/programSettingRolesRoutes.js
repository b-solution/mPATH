// const { Router } = require("express");
const { 
  index,
  add_users,
  update_role_users,
  remove_role,
  update,
  destroy,
  create,
  show
} = require("../controllers/ProgramSettingRolesController");

async function routes (fastify, options) {
  fastify.get("/api/v1/program_settings/roles", index);
  fastify.post("/api/v1/program_settings/roles/:id/add_users", add_users);
  fastify.post("/api/v1/program_settings/roles/update_role_users", update_role_users);
  fastify.post("/api/v1/program_settings/roles/remove_role", remove_role);
  fastify.put("/api/v1/program_settings/roles/:id", update);
  fastify.get("/api/v1/program_settings/roles/:id", show);
  fastify.delete("/api/v1/program_settings/roles/:id", destroy);
  fastify.post("/api/v1/program_settings/roles", create);
}
module.exports = routes