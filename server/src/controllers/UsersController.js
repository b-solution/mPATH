const { db } = require("../database/models");
const { _ } = require("lodash");
const qs = require("qs");
const jwt = require("jsonwebtoken");

// Function for retrieving user details
const preferences = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);
    console.log("Body-Params: ", body);
    let user = await getCurrentUser(req.headers["x-token"]);
    console.log("User Token: ", user);
    var pref = await user.getPreferences();
    var allowedNavigationTabs = await user.allowedNavigationTabs();
    var allowedSubNavigationTabs = await user.allowedSubNavigationTabs();
    var allowedSubNavigationForProgramSettingsTabs = await user.buildSubNavigationForProgramSettingsTabs();

    const preferences = {
      navigation_menu: "map",
      sub_navigation_menu: null,
      program_id: pref.program_id,
      project_id: pref.project_id,
      project_group_id: pref.project_group_id,
      allowed_navigation_tabs: allowedNavigationTabs,
      allowed_sub_navigation_tabs: allowedSubNavigationTabs,
      allowed_sub_navigation_for_program_settings_tabs: allowedSubNavigationForProgramSettingsTabs,
    };

    return { preferences: preferences };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching data" + error.stack };
  }
};

const current_user = async (req, res) => {
  try {
    var decoded = jwt.verify(req.query.token, process.env.JWT_SECRET_KEY);
    console.log("current user api", decoded);
    let user = await db.User.findOne({ where: { id: decoded.userId } });

    return { current_user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name } };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching data " + error };
  }
};

module.exports = {
  preferences,
  current_user,
};
