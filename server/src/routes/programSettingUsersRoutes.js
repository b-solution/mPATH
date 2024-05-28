// const { Router } = require("express");
const { 
  get_user_privileges,
  add_to_program,
  remove_from_program,
  index,
  update,
  create
} = require("../controllers/ProgramSettingUsersController");

// const router = Router();
// //Fetch all programs
// router.get("/", index);

// router.get("/:id", show);

// //Create a program
// router.post("/createprogram", createProgram);
// // Delete a program by ID
// router.delete("/deleteprogram/:id", deleteProgram);
// // Delete all programs
// router.delete("/deleteallprograms", deleteAllPrograms);

// module.exports = router;

async function routes (fastify, options) {
  fastify.get("/api/v1/program_settings/users/get_user_privileges", get_user_privileges);
  fastify.get("/api/v1/program_settings/users", index);
  fastify.post("/api/v1/program_settings/users/add_to_program",add_to_program)
  fastify.delete("/api/v1/program_settings/users/remove_from_program" ,remove_from_program)
  fastify.patch("/api/v1/program_settings/users/:id", update)
  fastify.post("/api/v1/program_settings/users", create)
}
module.exports = routes