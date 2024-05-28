// const { Router } = require("express");
const { program_setting_role } = require("../controllers/RolesController");

// const router = Router();
//Fetch all programs
// router.get("/program_setting_role", program_setting_role);

// //Create a program
// router.post("/createprogram", createProgram);
// // Delete a program by ID
// router.delete("/deleteprogram/:id", deleteProgram);
// // Delete all programs
// router.delete("/deleteallprograms", deleteAllPrograms);

// module.exports = router;

async function routes(fastify, options) {
  fastify.get("/api/v1/program_setting_role", program_setting_role);
}
module.exports = routes;
