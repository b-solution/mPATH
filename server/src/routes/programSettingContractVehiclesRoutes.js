// const { Router } = require("express");
const { 
  index,
  update,
  destroy,
  addContractVehicle
} = require("../controllers/ProgramSettingContractVehiclesController");

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
  fastify.get("/api/v1/program_settings/contract_vehicles", index);
  fastify.put("/api/v1/program_settings/contract_vehicles/:id", update);
  fastify.delete("/api/v1/program_settings/contract_vehicles/:id", destroy);
  fastify.post("/api/v1/program_settings/programs/add_contract_vehicle", addContractVehicle);
}
module.exports = routes