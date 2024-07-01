const { db } = require("../database/models");

const index = async (req, res) => {
  try {
    return { statuses: await db.Status.findAll() };
  } catch (error) {
    return { message: error };
  }
};

module.exports = {
  index,
};
