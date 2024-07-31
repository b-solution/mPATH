const { db } = require("../database/models");
const qs = require("qs");
const { _ } = require("lodash");
const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

async function index(req, res) {
  try {
    let responseHash = {};
    console.log("-----r", req);
    let params = qs.parse(req.query);
    if (params.project_id) {
      let project = await db.Project.findOne({ where: { id: params.project_id } });
      let facility_projects = await db.FacilityProject.findAll({ where: { project_id: project.id } });
      let facility_ids = _.uniq(
        _.map(facility_projects, function (fp) {
          return fp.facility_id;
        })
      );
      responseHash[project.id] = { facility_ids: facility_ids };
    }

    if (params.all == "true") {
      let user = await getCurrentUser(req.headers["x-token"]);
      let project_users = await db.ProjectUser.findAll({ where: { user_id: user.id } });
      let project_ids = _.uniq(
        _.map(project_users, function (pu) {
          return pu.project_id;
        })
      );
      let projects = await db.Project.findAll({ where: { id: project_ids } });
      let facility_projects = await db.FacilityProject.findAll({ where: { project_id: project.id } });
      let facility_project_group_by = _.groupBy(facility_projects, "project_id");
      for (var project of projects) {
        var fps = facility_project_group_by[project.id.toString()];
        responseHash[project.id] = { facility_ids: [] };
        if (fps) {
          var facility_ids = _.uniq(
            _.map(facility_projects, function (fp) {
              return fp.facility_id;
            })
          );
          responseHash[project.id] = { facility_ids: facility_ids };
        }
      }
    }
    let all_facilities = await db.Facility.findAll();
    responseHash.facilities = [];
    for (var facility of all_facilities) {
      var f = await facility.toJSON();
      responseHash.facilities.push(f);
    }

    return responseHash;
  } catch (error) {
    res.status(500);
    return { error: "Error fetching facility groups " + error };
  }
}
async function create(req, res) {
  try {
    const { db } = require("../database/models");
    console.log("Req---", req);
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);
    console.log("Testing Frontend", body);
    let user = await getCurrentUser(req.headers["x-token"]);
    let project = await db.Project.findOne({ where: { id: query.project_id } });
    let facility = db.Facility.build();
    body.facility.status = await db.Status.notStarted().id;
    body.facility.status_id = body.facility.status;

    facility.setAttributes(body.facility);
    facility.creator_id = user.id;
    facility.is_portfolio = false;
    await facility.save();
    let facilityProject = db.FacilityProject.build({
      facility_id: facility.id,
      project_id: project.id,
      facility_group_id: body.facility.facility_group_id,
    });

    if (!facilityProject.facility_group_id) {
      var dgroup = await project.getDefaultFacilityGroup();
      facilityProject.facility_group_id = dgroup.id;
    }
    await facilityProject.save();

    return { facility };
  } catch (error) {
    console.log(error);
    res.status(406);
    return { error: "Error " + error };
  }
}
async function show(req, res) {
  try {
    const { db } = require("../database/models");
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    var facilityProject = await db.FacilityProject.findOne({ where: { facility_id: params.id, project_id: query.project_id } });

    return { facility: facilityProject };
  } catch (error) {
    res.status(406);
    return { error: "Error " + error };
  }
}
async function bulkProjectsUpdate(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    let project = await db.Project.findOne({ where: { id: query.project_id } });
    let facilityProjects = await db.FacilityProject.findAll({ where: { project_id: project.id } });
    let facilityIds = compactAndUniq(
      _.map(facilityProjects, function (fp) {
        return fp.facility_id;
      })
    );
    facilityIds = compactAndUniq(facilityIds.concat(body.facility_ids));
    var createFacilityProjects = [];
    var createFacilityIds = [];
    for (var fid of body.facility_ids) {
      var exists = _.findIndex(facilityIds, parseInt(fid));
      if (exists < 0) {
        createFacilityProjects.push({ facility_id: fid, project_id: project.id });
        createFacilityIds.push(fid);
      }
    }
    if (createFacilityProjects.length > 0) {
      await db.FacilityProject.bulkCreate(createFacilityProjects);
    }
    return await db.Facility.findAll({ id: createFacilityIds });
  } catch (error) {
    res.status(406);
    return { error: "Error " + error };
  }
}
async function removeFacilityProject(req, res) {
  try {
    const query = qs.parse(req.query);
    const facilityProject = await db.FacilityProject.findOne({ where: { id: query.facility_project_id } });
    if (facilityProject) {
      facilityProject.destroy();
      return { facilityProject };
    }
  } catch (error) {
    console.log(error);
  }
}
async function update(req, res) {
  try {
    const { db } = require("../database/models");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    printParams(req);
    let facility = await db.Facility.findOne({ where: { id: params.id } });
    console.log("Facility---", facility);
    facility.facility_name = body.facility.facility_name;
    await facility.save();
    let facilityProject = await db.FacilityProject.findOne({ where: { project_id: body.facility.project_id, facility_id: facility.id } });
    facilityProject.facility_group_id = body.facility.facility_group_id;
    await facilityProject.save();
    return { facility };
  } catch (error) {
    res.status(406);
    console.log(error);
    return { error: "Error " + error };
  }
}
async function destroy(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    var facilityProjects = await db.FacilityProject.findAll({ where: { facility_id: params.id, project_id: query.project_id } });
    for (var fp of facilityProjects) {
      // var tasks = await fp.getTasks()
      // var issues = await fp.getIssues()
      // var risks = await fp.getRisks()
      // var lessons = await fp.getLessons()
      await fp.destroy();
    }
    var facility = await db.Facility.findOne({ where: { id: params.id } });
    if (facility) {
      await facility.destroy();
      return { facility: facility };
    } else {
      res.status(406);
      return { msg: "Facility not found" };
    }
  } catch (error) {
    res.status(406);
    return { msg: "" + error };
  }
}

module.exports = {
  index,
  create,
  show,
  bulkProjectsUpdate,
  removeFacilityProject,
  update,
  destroy,
};
