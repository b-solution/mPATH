// const router = Router();

const { adminPanel } = require("../controllers/adminCOntroller");

// // user registration route
// router.post("/register", register);

// // user login route
// router.post("/users/sign_in", login);

// module.exports = router;

async function routes(fastify, options) {
  fastify.post("/api/v1/admin", adminPanel);
}
module.exports = routes;
