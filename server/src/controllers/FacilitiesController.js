const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser } = require("../utils/helpers.js");
const facility = require("../database/models/facility");

const show = async (req, res) => {
  try {
    let project;
    const user = await getCurrentUser(req.headers["x-token"]);
    let projectIds = await user.authorizedProgramIds();
    if (projectIds.includes(req.query.project_id)) {
      project = await db.Project.findOne({ where: { id: req.query.project_id, status: "1" } });
    }
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
    const facility = await db.Facility.findByPk(req.params.id);
  } catch (error) {}
};
module.exports = {
  show,
  index,
  create,
  destroy,
};
