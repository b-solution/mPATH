const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser } = require("../utils/helpers.js");

const index = async (req, res) => {
  try {
    console.log("group controller");
    
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
};
