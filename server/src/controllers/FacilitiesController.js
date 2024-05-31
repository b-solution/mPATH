const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser } = require("../utils/helpers.js");

const show = async (req, res) => {
  try {
    let project;
    const user = await getCurrentUser(req.headers["x-token"]);
    let projectIds = await user.authorizedProgramIds();
    if (projectIds.includes(req.query.project_id)) {
      project = await db.Project.findOne({ where: { id: req.query.project_id, status: "1" } });
    }
    console.log("Project---", project);
    const facilityProject = await db.FacilityProject.findOne({
      include: [
        {
          model: db.Facility,
          include: [
            {
              model: db.FacilityGroup,
            },
          ],
        },
        {
          model: db.Task,
          include: [
            {
              model: db.TaskType,
            },
            {
              model: db.TaskStage,
            },
            {
              model: db.Note,
            },
            {
              model: db.FacilityProject,
            },
          ],
        },
      ],
      where: { facility_id: req.params.id, project_id: project.id },
    });
    console.log("ShowFP---", facilityProject);
    return { facilityProject: await facilityProject.toJSON() };
  } catch (error) {
    return { error };
  }
};
const index = async (req, res) => {
  try {
    let responseHash = {};
    const all_facilities = await db.Facility.findAll({
      include: [
        {
          model: db.FacilityGroup,
        },
      ],
    });
    responseHash.facilities = await Promise.all(all_facilities.map((facility) => facility.toJSON()));
    if (req.query.project_id) {
      const project = await db.Project.findOne({ where: { id: req.query.project_id } });
      const facility_ids = await project.getFacilities({ attributes: ["id"] });
      responseHash.facility_ids = facility_ids.map((facility) => facility.id);
    }
    console.log("facility_ids:---", responseHash);
    return { responseHash };
  } catch (error) {
    console.log(error);
  }
};
const create = async (req, res) => {
  try {
    const project = await db.Project.findByPk(req.query.project_id);
    const user = await getCurrentUser(req.headers["x-token"]);
    const facilityParams = req.body;
    const facilityData = {
      ...facilityParams,
      creator_id: user.id,
      is_portfolio: false,
      project_id: req.query.project_id,
    };
    const newFacility = await project.createFacility(facilityData);
    return { facility: await newFacility.toJSON() };
  } catch (error) {
    return { error: error, msg: "facility not created successfully" };
  }
};
const destroy = async (req, res) => {
  try {
    const facility = await db.Facility.findOne({ where: { id: req.params.id, project_id: req.query.project_id } });
    console.log("Hi----", facility);
    if (facility) {
      await facility.destroy();
      return { msg: "Facility deleted successfully" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Facility not deleted successfully" };
  }
};
const update = async (req, res) => {
  try {
    const facility = await db.Facility.findByPk(req.params.id, {
      include: [
        {
          model: db.FacilityGroup,
        },
      ],
    });
    if (req.body.facility) {
      if (req.body.facility.facility_group_name && req.body.facility.facility_group_name !== "undefined") {
        const updatedFacilityGroupName = await db.FacilityGroup.update(
          {
            name: req.body.facility.facility_group_name,
          },
          { where: { id: facility.facility_group_id } }
        );
        facility.set(req.body.facility);
        await facility.save();
      }
    }
    const facility_project = await db.FacilityProject.findOne({ where: { project_id: facility.project_id } });
    facility_project.set(req.body);
    await facility_project.save();
    return { facility: await facility.toJSON() };
  } catch (error) {
    console.log(error);
  }
};
const duplicate_to_program = async (req, res) => {
  console.log("duplicate:--", req.body);
  try {
    let result = null;
    const facility_project = await db.FacilityProject.findOne({
      where: { facility_id: req.body.facility_id, project_id: req.body.source_program_id },
    });
    if (facility_project) {
      result = await facility_project.duplicateToProgram(req.body.target_program_id, req.body.target_facility_group_id);
      console.log("Get-Result----", result);
    }
    if (result.status) {
      return { msg: result.message };
    }
  } catch (error) {
    return { msg: error };
  }
};
const move_to_program = async (req, res) => {
  try {
    let result = null;
    const facility_project = await db.FacilityProject.findOne({
      where: { facility_id: req.body.facility_id, project_id: req.body.source_program_id },
    });
    if (facility_project) {
      result = await facility_project.moveToProgram(req.body.target_program_id, req.body.target_facility_group_id);
      console.log("Result---", result);
      return { msg: result.message };
    }
  } catch (error) {
    return { msg: error };
  }
};
module.exports = {
  show,
  index,
  create,
  destroy,
  update,
  duplicate_to_program,
  move_to_program,
};
