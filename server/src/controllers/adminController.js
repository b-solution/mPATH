const setAdminPanel = require("../utils/admin");
const { getCurrentUser } = require("../utils/helpers");
const { db } = require("../database/models");
const fastify = require("fastify")({
  logger: true,
});

const adminPanel = async (req, res) => {
  try {
    console.log("Admin Panel", req.headers);
    const currentUser = await getCurrentUser(req.headers["x-token"]);
    // await setAdminPanel(db, fastify, currentUser, req.headers["x-token"]);
    console.log("User----", currentUser);
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

module.exports = {
  adminPanel,
};
