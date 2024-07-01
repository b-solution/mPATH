const { db } = require("../database/models");

const index = async (req, res) => {
  try {
    qs = require("qs");
    const params = qs.parse(req.params);
    const collection = await db.FacilityProject.findOne({
      include: [
        {
          model: db.Task,
          attributes: ["text", "id"],
        },
        {
          model: db.Issue,
          attributes: ["title", "id"],
        },
      ],
      where: { facility_id: params.facility_id, project_id: params.project_id },
    });
    return { collection: await collection.toJSON() };
  } catch (error) {}
};

const show = async (req, res) => {
  try {
    const qs = require("qs");
    const params = qs.parse(req.params);
    const facilityProject = await db.FacilityProject.findOne({ where: { facility_id: params.id, project_id: params.project_id } });
    return { facilityProject: await facilityProject.toJSON() };
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

const update = async (req, res) => {
  const qs = require("qs");
  const params = qs.parse(req.params);
  const body = qs.parse(req.body);
  const facility = await db.Facility.findByPk(params.facility_id);
  console.log("Facility---", facility);
  const facilityProject = await db.FacilityProject.findOne({
    attributes: [
      "id",
      "facility_id",
      "project_id",
      "due_date",
      "status_id",
      "progress",
      "color",
      "facility_group_id",
      "project_facility_group_id",
      "issue_id",
      "created_at",
      "updated_at",
      "StatusId",
      "IssueId",
    ],
    where: { id: params.id, facility_id: facility.id },
  });
  await facilityProject.update({ due_date: body.facility_params.due_date, status_id: body.facility_params.status_id });
  console.log("fp=====", facilityProject);
  const updatedFacilityProject = await db.FacilityProject.findOne({
    include: [
      {
        model: db.Project,
        attributes: ["name"],
      },
      {
        model: db.Status,
        attributes: ["name"],
      },
    ],
    where: { id: facilityProject.id },
  });
  return { facilityProject: await updatedFacilityProject.toJSON() };
};
module.exports = {
  index,
  show,
  update,
};
