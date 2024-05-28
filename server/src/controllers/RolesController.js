const { db } = require("../database/models");

// Function for retrieving user details
const program_setting_role = async (req, res) => {
  console.log("role hello");
  try {
    const { db } = require("../database/models");

    const psr = await db.Role.programAdminUserRole();

    return { program_setting_role: await psr.toJSON() };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching data" };
  }
};

module.exports = {
  program_setting_role,
};
