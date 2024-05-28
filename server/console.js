let repl = require('repl');
let db = require('./src/database/models');

// console.log("db ->", db)
models = db["db"]
Object.keys(models).forEach(modelName => {
  // console.log("modelName", modelName)
  global[modelName] = models[modelName];
});

let replServer = repl.start({
  prompt: 'app > '
});

replServer.context.db = models;