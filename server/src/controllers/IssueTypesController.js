const { db } = require("../database/models");

const index = async (req, res) => {
  try {
    const issueTypes = await db.IssueType.findAll();
    return { issueTypes: issueTypes };
  } catch (error) {
    return { error: "error fetching issue types" };
  }
};

module.exports = {
  index,
};
