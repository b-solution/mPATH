const { index } = require("../controllers/IssueSeveritiesController");



async function routes (fastify,options){
fastify.get("/api/v1/issue_severities", index);
}

module.exports = routes
