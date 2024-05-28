const { db } = require("../database/models");
const { _ } = require("lodash");
const qs = require("qs");

const index = async (req, res) => {
  try {
    console.log("Index Method: ", req.settings);
    return req.settings;
  } catch (error) {
  }
};

const update = async (req, res) => {
  try {
    const body = qs.parse(req.body);
    console.log("Body: ", body);
    const setting = req.settings.update(body);
    return setting;
  } catch (error) {
    return 
  }
};

module.exports = {
  index,
  update,
};
