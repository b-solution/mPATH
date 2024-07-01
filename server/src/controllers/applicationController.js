// const GC = require('gc')
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const moment = require("moment-timezone");
const { getCurrentUser } = require("../utils/helpers");

// const authenticateRequest = async (req, res, next) => {
//   try {
//     const token = req.headers["x-token"];
//     const currentUser = await getCurrentUser(req.headers["x-token"]);
//     console.log("token----", token);
//     if (!token) {
//       return { error: "Not Authenticated" };
//     }
//       let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     console.log("decoded:---", decoded);
//     currentUser = { id: decoded.userId };
//     next();
//   } catch (err) {
//     console.log(err);
//     return { error: "Not Authenticated" };
//   }
// };

const userTimeZone = async (req, res, next) => {
  try {
    const currentUser = await getCurrentUser(req.headers["x-token"]);
    if (currentUser) {
      //   const previousTimezone = moment.tz.guess();
      moment.tz.setDefault("America/New_York");
    }
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

module.exports = {
  userTimeZone,
};
