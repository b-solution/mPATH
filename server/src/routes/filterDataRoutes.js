// const { Router } = require("express");
const { 
  programAdminPrograms,
  programs,
  users,
  statuses,
  categories,
  stages,
  issueTypes,
  issueSeverities,
  riskApproaches,
  riskPriorityLevel
      } = require("../controllers/FilterDataController");

// const router = Router();
// //Fetch all programs
// router.get("/program_admin_programs", program_admin_programs);

// module.exports = router;

async function routes (fastify, options) {
  fastify.get("/api/v1/filter_data/program_admin_programs", programAdminPrograms);
  fastify.get("/api/v1/filter_data/programs", programs);  
  fastify.get("/api/v1/filter_data/users", users);
  fastify.get("/api/v1/filter_data/statuses", statuses);
  fastify.get("/api/v1/filter_data/categories", categories);
  fastify.get("/api/v1/filter_data/stages", stages);
  fastify.get("/api/v1/filter_data/issueTypes", issueTypes);
  fastify.get("/api/v1/filter_data/issue_severities", issueSeverities);
  fastify.get("/api/v1/filter_data/risk_approaches", riskApproaches);
  fastify.get("/api/v1/filter_data/risk_priority_level", riskPriorityLevel);

}
module.exports = routes