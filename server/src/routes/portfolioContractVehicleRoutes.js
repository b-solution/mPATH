// const { Router } = require("express");
const { index, create, update } = require("../controllers/PortfolioContractVehicleController");

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
  fastify.get("/api/v1/portfolio/contract_vehicles", index);
  fastify.post("/api/v1/portfolio/contract_vehicles", create);
  fastify.put("/api/v1/portfolio/contract_vehicles/:id", update);
}
module.exports = routes;
