const { db } = require("../database/models");

const index = async (req, res) => {
  try {
    const allIssueSeverities = await db.IssueSeverity.findAll();
    return { issueseverities: allIssueSeverities };
  } catch (error) {
    return { error: "Error fetching issue severities" };
  }
};

module.exports = {
  index,
};
