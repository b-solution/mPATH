// const { Router } = require("express");
const {
  index,
  create,
  show,
  bulkProjectsUpdate,
  removeFacilityProject,
  update,
  destroy,
} = require("../controllers/ProgramSettingFacilitiesController");

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

async function routes(fastify, options) {
  fastify.get("/api/v1/program_settings/facilities", index);
  fastify.post("/api/v1/program_settings/facilities", create);
  fastify.get("/api/v1/program_settings/facilities/:id", show);
  fastify.put("/api/v1/program_settings/facilities/bulk_projects_update", bulkProjectsUpdate);
  fastify.delete("/api/v1/program_settings/facilities/remove_facility_project", removeFacilityProject);
  fastify.put("/api/v1/program_settings/facilities/:id", update);
  fastify.delete("/api/v1/program_settings/facilities/:id", destroy);
}
module.exports = routes;
