// const { Router } = require("express");
const { preferences, current_user } = require("../controllers/UsersController");

// const router = Router();

// // Route for all users in adminPanel
// router.get("/preferences", preferences);
// router.get("/current_user", current_user);

// module.exports = router;

async function routes (fastify, options) {
  fastify.get("/api/v1/users/preferences", preferences);
  fastify.get("/api/v1/users/current_user", current_user);
}
module.exports = routes