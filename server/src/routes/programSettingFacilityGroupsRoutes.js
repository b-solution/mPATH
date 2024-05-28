// const { Router } = require("express");
const { 
  index,
  create,
  bulk_project_update,
  update,
  destroy
} = require("../controllers/ProgramSettingFacilityGroupsController");

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
  fastify.get("/api/v1/program_settings/facility_groups", index);
  fastify.post("/api/v1/program_settings/facility_groups", create);
  fastify.put("/api/v1/program_settings/facility_groups/bulk_project_update", bulk_project_update);
  fastify.put("/api/v1/program_settings/facility_groups/:id", update);
  fastify.delete("/api/v1/program_settings/facility_groups/:id", destroy);

}
module.exports = routes