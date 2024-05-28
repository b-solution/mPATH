const { 
  download
} = require("../controllers/DownloadResourceFilesController");


async function routes (fastify, options) {
  fastify.get("/api/v1/download/:id",download);
}
module.exports = routes