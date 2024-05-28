// const { Router } = require("express");
const { 
  index,
  update,
  destroy
} = require("../controllers/ProgramSettingContractsController");

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
  fastify.get("/api/v1/program_settings/contracts", index);
  fastify.put("/api/v1/program_settings/contracts/:id", update);
  fastify.delete("/api/v1/program_settings/contracts/:id", destroy);
  
}
module.exports = routes