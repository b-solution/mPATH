const { db } = require("../database/models/index.js");
const qs = require('qs');
const {_} = require("lodash") 
const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')

async function download(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)
  
    // let user = await getCurrentUser(req.headers['x-token'])
  
    var blob = await db.ActiveStorageBlob.findOne({where: {id: params.id}})
    var folderPath = `${blob.getFolderPath()}/${blob.filename}`
    console.log("**** blob",blob, folderPath )

    return res.sendFile(folderPath) // serving path.join(__dirname, 'public', 'myHtml.html') directly

  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}


module.exports = {
  download
};