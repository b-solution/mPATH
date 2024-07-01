const { db } = require("../database/models");
const { _ } = require("lodash");
const qs = require("qs");

const currentProfile = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    let user = await getCurrentUser(req.headers["x-token"]);
    var responseHash = {
      current_user: {},
      preferences: {},
      programs: {},
      project_groups: {},
      projects: {},
    };

    var activeProjectIds = await user.authorizedProgramIds();
    var activeProjects = await db.Project.findAll({ where: { id: activeProjectIds } });
    var allFacilityProjects = await db.FacilityProject.findAll({ where: { project_id: activeProjectIds } });
    var allFacilityProjectIds = compactAndUniq(_.map(allFacilityProjects, "id"));
    var allFacilityIds = compactAndUniq(_.map(allFacilityProjects, "facility_id"));
    var allFacilities = await db.Facility.findAll({ where: { id: allFacilityIds } });
    var allFacilityGroupIds = compactAndUniq(_.map(allFacilities, "facility_group_id"));
    var allFacilityGroups = await db.FacilityGroup.findAll({ where: { id: allFacilityGroupIds } });

    projectHash = [];

    for (var project of activeProjects) {
      var facilityProjects = _.filter(allFacilityProjects, function (f) {
        return f.project_id == project.id;
      });
      var facilityIds = compactAndUniq(_.map(facilityProjects, "facility_id"));
      var facilities = _.filter(allFacilities, function (f) {
        return facilityIds.includes(f.id);
      });

      if (facilities.length > 0) {
        var facilityGroupIds = compactAndUniq(_.map(facilities, "facility_group_id"));
        var facilityGroups = _.filter(allFacilityGroups, function (f) {
          return facilityGroupIds.includes(f.id);
        });

        var h = {
          id: project.id,
          name: project.name,
          project_group_ids: facilityGroupIds,
          project_ids: facilityIds,
        };
        projectHash.push(h);
      }
    }

    responseHash.current_user = await user.toJSON();
    responseHash.preferences = await user.getPreferences();
    responseHash.programs = projectHash;
    responseHash.project_groups = _.map(allFacilityGroups, function (fg) {
      return { id: fg.id, name: fg.name };
    });
    responseHash.projects = _.map(allFacilities, function (fg) {
      return { id: fg.id, name: fg.facility_name, facility_group_id: fg.facility_group_id };
    });

    return responseHash;
  } catch (error) {
    res.code(500);
    return { error: "Error fetching profile" + error.stack };
  }
};

const update = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    let user = await getCurrentUser(req.headers["x-token"]);
    user.update(body);
    var responseHash = {
      current_user: await user.toJSON(),
      preferences: await user.getPreferences(),
      preference_url: await user.preferenceUrl(),
      msg: "Profile updated successfully",
    };
    return responseHash;
  } catch (error) {
    res.code(500);
    return { error: "Error fetching profile" + error.stack };
  }
};

// Function for retrieving user details
const index = async (req, res) => {
  try {
    // Fetch user profile using req.userId
    const user_db = await db.User.findByPk(req.userId);
    console.log("User Db---", user_db);
    if (!user_db) {
      return res.code(404).json({ error: "User not found" });
    } else {
      return { username: user_db.username, email: user_db.email };
    }
  } catch (error) {
    res.code(500);
    return { error: "Error fetching profile" };
  }
};

module.exports = {
  index,
  currentProfile,
  update,
};
