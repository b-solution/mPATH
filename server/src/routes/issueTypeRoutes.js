const {index} = require('../controllers/IssueTypesController')


async function routes (fastify, options){
    fastify.get('/api/v1/issue_types', index)
}

module.exports = routes