const { index, update } = require("../controllers/SettingsController");
const { getCurrentUser } = require("../utils/helpers.js");
const { db } = require("../database/models");

async function requireAdminAndSettings(req, res) {
  try {
    console.log("Admin-Middleware", req.headers["x-token"]);
    let user = await getCurrentUser(req.headers["x-token"]);
    console.log("Current-User: ", user);
    if (!user || user.role !== 1) {
      return res.status(404).json({ message: "Resource not found" });
    }
    const settings = await db.Setting.findOne();
    console.log("Settings: ", settings);
    if (!settings) {
      return res.status(404).json({ message: "Resource not found" });
    }
    req.settings = settings;
    //next();
  } catch (error) {
    return { error: "Error" };
  }
}

// async function setResource(req, res) {
//   try {
//     console.log("---Resource-Middleware---");
//     // const settings = await Setting.findOne();
//     // if (!settings) {
//     //   return res.status(404).json({ message: "Resource not found" });
//     // }
//     //req.settings = settings;
//     //next();
//   } catch (error) {
//     return { error: "Error " };
//   }
// }
// async function requireAdmin(req, res, next) {
//   try {
//     console.log("Admin-Middleware", req.headers["x-token"]);
//     let user = await getCurrentUser(req.headers["x-token"]);
//     console.log("Current-User: ", user);
//     // if (!user || !user.isAdmin) {
//     //   return res.status(404).json({ message: "Resource not found" });
//     // }
//     //next();
//   } catch (error) {
//     return { error: "Error" };
//   }
// }

// const setResource = async (req, res, next) => {
//   try {
//     console.log("---Resource-Middleware---");
//     // const settings = await Setting.findOne();
//     // if (!settings) {
//     //   return res.status(404).json({ message: "Resource not found" });
//     // }
//     //req.settings = settings;
//     //next();
//   } catch (error) {
//     return { error: "Error " };
//   }
// };
async function routes(fastify, options) {
  fastify.addHook("preHandler", requireAdminAndSettings);
  fastify.get("/api/v1/settings", index);
  fastify.post("/api/v1/settings", update);
}

module.exports = routes;
