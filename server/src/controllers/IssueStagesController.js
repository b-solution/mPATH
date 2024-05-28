const { db } = require("../database/models");

const index = async (req, res) => {
  try {
    console.log("Req");
    const issueStages = await db.IssueStage.findAll();
    return { issueStages: issueStages };
  } catch (error) {
    return { error: "error fetching issue stages" };
  }
};
module.exports = {
  index,
};
