const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

const show = async (req, res) => {
  try {
    console.log("**** show", req.params.id);
    let task = await db.Task.findOne({ where: { id: req.params.id } });
    return { task: task.dataValues };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching task " + error };
  }
};

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require("qs");
    let params = qs.parse(req.params);
    console.log("task-params", params);
    console.log("BODY", req.body);
    //let taskParams = params.task;
    params.task = {
      task_files: req.body.task_files,
    };
    let task = db.Task.build();
    let user = await getCurrentUser(req.headers["x-token"]);
    await task.createOrUpdateTask(params, { user: user, project_id: params.program_id, facility_id: params.project_id });

    return { task: await task.toJSON(), msg: "Task created successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching task " + error };
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require("qs");
    console.log("task params", qs.parse(req.body));
    let params = qs.parse(req.body);
    //let taskParams = params.task;
    console.log("Task Params: ", params);
    let task = await db.Task.findOne({ where: { id: req.params.id } });
    console.log("Update for task: ", task);
    task.set(params);
    await task.save();

    await task.assignUsers(params);
    await task.manageNotes(params);
    await task.manageChecklists(params);
    await task.addResourceAttachment(params);

    // task = await task.update(params)
    // console.log("after update", task)

    return { task: await task.toJSON(), msg: "Task updated successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching task " + error };
  }
};

const createDuplicate = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    var qs = require("qs");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);
    console.log("Dup Params: ", params.id);
    let task = await db.Task.findOne({ where: { id: params.id } });
    console.log("Task Dup: ", task);
    let newTask = await task.createCopy();
    console.log("New Task: ", newTask);
    return { task: newTask.dataValues, msg: "Duplicate task created successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching task " + error };
  }
};

const createBulkDuplicate = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    var qs = require("qs");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    // printParams(req);
    console.log("QUERY ", req.query);
    let task = await db.Task.findOne({ where: { id: req.params.id } });
    let allResources = [];
    let qFacilityProjectIds = query.facility_project_ids;
    let qProjectContractIds = query.project_contract_ids;
    let qProjectContractVehicleIds = query.project_contract_vehicle_ids;

    var newResource;

    if (qFacilityProjectIds) {
      for (var qfp of qFacilityProjectIds) {
        newResource = await task.createCopy({ facilityProjectId: qfp });

        allResources.push(newResource);
      }
    }

    if (qProjectContractIds) {
      for (var qfp of qProjectContractIds) {
        newResource = await task.createCopy({ projectContractId: qfp });
        allResources.push(newResource.dataValues);
      }
    }

    if (qProjectContractVehicleIds) {
      for (var qfp of qProjectContractVehicleIds) {
        newResource = await task.createCopy({ projectContractVehicleId: qfp });
        allResources.push(newResource.dataValues);
      }
    }

    return { tasks: allResources, msg: "Bulk duplicate task created successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching task " + error };
  }
};

const destroy = async (req, res) => {
  try {
    const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    var qs = require("qs");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    let task = await db.Task.findOne({ where: { id: req.params.id } });
    console.log("Destroy: ", task);
    //var resJSON = await task.toJSON();
    //console.log("Json: ", resJSON);
    await task.destroy();

    return { task: task.dataValues, msg: "Task destroy successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching task " + error };
  }
};

module.exports = {
  update,
  show,
  create,
  createDuplicate,
  destroy,
  createBulkDuplicate,
};
