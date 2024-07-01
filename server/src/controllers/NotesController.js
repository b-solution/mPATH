const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser } = require("../utils/helpers");
// Function for retrieving user details
let facilityProjAtts = [
  "id",
  "facility_id",
  "project_id",
  "due_date",
  "status_id",
  "progress",
  "color",
  "facility_group_id",
  "project_facility_group_id",
];
let projContAtts = ["id", "project_id", "user_id", "progress", "contract_project_datum_id", "facility_group_id"];

const index = async (req, res) => {
  var qs = require("qs");
  try {
    // Fetch user profile using req.userId
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    let body = qs.parse(req.body);
    let allNotes = [];
    console.log("Params--", params);
    if (params.program_id && params.project_id) {
      let program_id = params.program_id;
      let facility_id = params.project_id;
      let facility_project = await db.FacilityProject.findOne({
        attributes: facilityProjAtts,
        where: { project_id: program_id, facility_id: facility_id },
        raw: true,
      });
      console.log("facility_project--", facility_project);
      allNotes = await db.Note.findAll({ where: { noteable_id: facility_project.id, noteable_type: "FacilityProject" } });
    } else if (params.project_contract_id) {
      let project_contract = await db.ProjectContract.findOne({
        attributes: ["id", "project_id", "user_id", "progress", "contract_project_datum_id", "facility_group_id"],
        where: { id: params.project_contract_id },
        raw: true,
      });
      console.log("project_contract--", project_contract);
      allNotes = await db.Note.findAll({
        where: { noteable_id: project_contract.id, noteable_type: "ProjectContract" },
      });
    } else if (params.project_contract_vehicle_id) {
      let project_contract_vehicle = await db.ProjectContractVehicle.findOne({ where: { id: params.project_contract_vehicle_id }, raw: true });
      console.log(project_contract_vehicle);
      allNotes = await db.Note.findAll({
        where: { noteable_id: project_contract_vehicle.id, noteable_type: "ProjectContractVehicle" },
      });
    }

    let res_notes = [];
    for (var l of allNotes) {
      res_notes.push(await l.toJSON());
    }
    return { notes: res_notes };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching lessons " + error };
  }
};

const show = async (req, res) => {
  try {
    let note = await db.Note.findOne({ where: { id: req.params.id } });

    return { note: await note.toJSON() };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching note " + error };
  }
};

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require("qs");
    console.log("note body", req.body);
    console.log("note params", req.params);
    let params = qs.parse(req.body);
    let noteParams = params;
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    let note = db.Note.build();
    let user = await getCurrentUser(req.headers["x-token"]);
    let facilityProject = await db.FacilityProject.findOne({
      attributes: facilityProjAtts,
      where: { project_id: req.params.program_id, facility_id: req.params.project_id },
    });
    console.log("FacilityProj:--", facilityProject);
    noteParams["noteable_id"] = facilityProject.id;
    noteParams["noteable_type"] = "FacilityProject";

    note.set(noteParams);
    await note.save();

    return { note: await note.toJSON(), msg: "Note created successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching note " + error };
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require("qs");
    let user = await getCurrentUser(req.headers["x-token"]);
    let owner = null,
      noteableType = "";
    if (req.params.project_id && req.params.program_id) {
      const projects = await user.getProjects({
        where: { status: 1 },
        include: [
          {
            model: db.FacilityProject,
          },
        ],
      });
      //const project = projects.find((p) => Number(p.id) === Number(req.params.program_id));
      owner = await db.FacilityProject.findOne({ attributes: ["id", "facility_id"], where: { facility_id: req.params.project_id } });
      noteableType = "FacilityProject";
    } else if (req.params.project_contract_id) {
      const authorizedData = await user.getAuthorizedData({ project_ids: [req.params.project_contract_id] });
      const authorizedProjContIds = authorizedData.authorized_project_contract_ids;
      const projectContracts = await db.ProjectContract.findAll({
        attributes: projContAtts,
        where: { id: authorizedProjContIds },
      });
      owner = projectContracts.find((pc) => pc.id === req.params.project_contract_id);
      noteableType = "ProjectContract";
    } else {
      owner = await db.ProjectContractVehicle.findOne({ where: { id: req.params.project_contract_vehicle_id } });
      noteableType = "ProjectContractVehicle";
    }
    let note = await db.Note.findOne({ where: { id: req.params.id } });
    const updatedNote = await note.update({ noteable_id: owner.id, noteable_type: noteableType });

    // await note.assignUsers(params);
    // await note.manageNotes(noteParams);
    // await note.manageChecklists(noteParams);

    return { note: await updatedNote.toJSON(), msg: "Note updated successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching note " + error };
  }
};

module.exports = {
  update,
  show,
  create,
  index,
};
