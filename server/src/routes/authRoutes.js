const { Router } = require("express");
const { register, login, verifyToken } = require("../controllers/AuthController");

// const router = Router();

// // user registration route
// router.post("/register", register);

// // user login route
// router.post("/users/sign_in", login);

// module.exports = router;


async function routes (fastify, options) {
  fastify.post("/api/v1/auth/register", register);
  fastify.get("/api/v1/auth/verify_token", verifyToken);
  fastify.post("/api/v1/auth/users/sign_in", login);
}
module.exports = routes
