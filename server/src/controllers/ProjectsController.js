const { db } = require("../database/models");
const { _ } = require("lodash");
const qs = require("qs");

// Function for retrieving user details
const index = async (req, res) => {
  console.log("hi---");
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    printParams(req);
    let user = await getCurrentUser(req.headers["x-token"]);
    let projectIds = await user.authorizedProgramIds();
    console.log("finding----Ids", projectIds);
    let projects = await db.Project.findAll({ where: { id: projectIds, status: "1" } });
    console.log("finding----", projects);
    let responseHash = [];
    for (var project of projects) {
      var p = await project.toJSON();
      let users = await project.getUsers();
      let facilities = await db.Facility.findAll({ where: { project_id: project.id } });
      let issues = await project.getIssues();
      const facilityProject = await db.FacilityProject.findAll({
        attributes: ["id"],
        where: { project_id: project.id },
      });
      const facilityProjectIds = facilityProject.map((fp) => fp.id);
      const tasks = await db.Task.findAll({
        where: { facility_project_id: facilityProjectIds },
      });
      const lessons = await db.Lesson.findAll({
        where: {
          facility_project_id: facilityProjectIds,
        },
      });
      const risks = await db.Risk.findAll({
        where: {
          facility_project_id: facilityProjectIds,
        },
      });
      p.facilities = facilities.map((facility) => facility.toJSON());
      p.users = users.map((u) => u.toJSON());
      p.issues = issues.map((i) => i.toJSON());
      p.tasks = tasks.map((t) => t.toJSON());
      p.lessons = lessons.map((l) => l.toJSON());
      p.risks = risks.map((r) => r.toJSON());
      responseHash.push(p);
    }
    return { projects: responseHash };
  } catch (error) {
    console.log(error);
    res.code(500);
    return { error: "Error fetching projects" + error };
  }
};

const show = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    var programId = params.id;
    let user = await getCurrentUser(req.headers["x-token"]);
    console.log("User: ", user);
    // Fetch all users from the database
    const program = await db.Project.findOne({ where: { id: programId } });
    let response = await program.build_json_response({ user: user });

    //As response contains all data, we will add data in steps.
    // For now returning static response. and then will override
    // the data with real data
    res.code(200);
    return { project: response };
    // console.log("Program: ", program);
  } catch (error) {
    res.code(500);
    console.log(error);
    return { error: "Error fetching program " + error.stack };
  }
};

const project_facility_hash = async (req, res) => {
  try {
    const { db } = require("../database/models");

    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    let user = await getCurrentUser(req.headers["x-token"]);

    // Fetch all users from the database
    let projectIds = await user.authorizedProgramIds();
    let projects = await db.Project.findAll({ where: { id: projectIds, status: "1" } });
    let facilityProjects = await db.FacilityProject.findAll({
      attributes: ["id", "facility_id", "project_id", "due_date", "status_id", "progress", "color", "facility_group_id", "project_facility_group_id"],
      where: { project_id: projectIds },
    });
    let gFacilityProjects = _.groupBy(facilityProjects, "project_id");
    Object.keys(gFacilityProjects).forEach(function (key) {
      var values = gFacilityProjects[key];
      gFacilityProjects[key] = _.map(values, function (fp) {
        return { facility_id: fp.facility_id, facility_project_id: fp.id };
      });
    });

    res.code(200);
    return gFacilityProjects;
    // console.log("Program: ", program);
  } catch (error) {
    res.code(500);
    return { error: "Error fetching program " + error };
  }
};

module.exports = {
  index,
  show,
  project_facility_hash,
};
