const { db } = require("../database/models");
const {
  fn, Op, Model, QueryTypes
} = require('sequelize');
const qs = require('qs');

// Function for retrieving user details
const index = async (req, res) => {
  try {
    const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')
    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])
    var project = await db.Project.findOne({where: {id: params.id}})
    var favoriteFilters = await db.FavoriteFilter.findAll({
      where: {
        [Op.or]: {
          user_id: user.id,
          shared: true,
        }
      }
    })
    var response = []
    for(var favoriteFilter of favoriteFilters){
      var ff = await favoriteFilter.toJSON()
      response.push(ff)
    }

    res.type('application/json').code(200)
    return(response);

  } catch (error) {
    res.code(500)
    return({ error: "Error fetching data"+error.stack });
  }
};

const reset = async (req, res) => {
  try {
    const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')
    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])
    var project = await db.Project.findOne({where: {id: params.id}})
    var favoriteFilter = await db.FavoriteFilter.findOne({
      where: { project_id: project.id  }
    })
    if(favoriteFilter){
      await db.QueryFilter.destroy({where: {favorite_filter_id: favoriteFilter.id}})
      await favoriteFilter.destroy()
    }
    
    // Fetch user profile using req.userId
    res.type('application/json').code(200)
    return({message: "Filters destroyed successfully", id: favoriteFilter.id});

  } catch (error) {
    res.code(500)
    return({ error: "Error fetching data"+error.stack });
  }
}
module.exports = {
  index,
  reset
};
