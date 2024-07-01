const { db } = require("../database/models");
const { _, result } = require("lodash");
const { getCurrentUser } = require("../utils/helpers.js");

const index = async (req, res) => {
  try {
    var qs = require("qs");
    const params = qs.parse(req.query);
    console.log("group controller");
    let responseHash = {};
    responseHash.facilityGroups = await db.FacilityGroup.findAll();
    if (params.project_id) {
      const project = await db.Project.findOne({
        include: [
          {
            model: db.FacilityGroup,
            attributes: ["id"],
          },
        ],
        where: { id: params.project_id },
      });
      if (project) {
        responseHash.projectFacilityGroupIds = project.FacilityGroups.map((fG) => {
          console.log("hi----", pFG.dataValues);
          return fG.id;
        });
      }
    }
    return { responseHash };
  } catch (error) {
    console.log(error);
  }
};
const create = async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req.headers["x-token"]);
    const qs = require("qs");
    const body = qs.parse(req.body);
    console.log();
    const newFacilityGroup = db.FacilityGroup.build();
    const data = {
      name: body.facility_group.name,
      status: 1,
      is_portfolio: false,
      user_id: currentUser.id,
      project_id: body.facility_group.project_id,
    };
    newFacilityGroup.set(data);
    await newFacilityGroup.save();
    if (body.facility_group.project_id) {
      const project = await db.Project.findOne({
        where: { id: body.facility_group.project_id },
      });
      const added = await project.addFacilityGroup(newFacilityGroup);
    }
  } catch (error) {
    return { message: error };
  }
};
const update = async (req, res) => {
  try {
    const facilityGroup = await db.FacilityGroup.findByPk(req.params.id);
    const facilityGroupData = facilityGroup.get({ plain: true });
    const updatedFacilityGroupData = {
      ...facilityGroupData,
      name: req.body.facility_group.name,
    };
    facilityGroup.set(updatedFacilityGroupData);
    await facilityGroup.save();
    return { facilityGroup: await facilityGroup.toJSON() };
  } catch (error) {
    return { message: error };
  }
};
const destroy = async (req, res) => {
  try {
    const qs = require("qs");
    const body = qs.parse(req.body);
    console.log("body---", body);
    const facilityGroup = await db.FacilityGroup.findByPk(req.params.id);
    const project = await db.Project.findOne({ include: [{ model: db.FacilityGroup }], where: { id: body.project_id } });
    console.log("project----", project.FacilityGroups);
    const isGroupInProgram = await project.hasFacilityGroup(facilityGroup);
    if (isGroupInProgram) {
      if (!facilityGroup.is_default && !facilityGroup.is_portfolio) {
        const projectFacilityGroup = await db.ProjectFacilityGroup.findOne({
          where: { project_id: body.project_id, facility_group_id: facilityGroup.id },
        });
        await projectFacilityGroup.applyUnassigedToResources();
        console.log("hi -----", projectFacilityGroup);
        await facilityGroup.destroy();
        return { message: "Group removed succesfully" };
      } else {
        const projectFacilityGroup = await db.ProjectFacilityGroup.findOne({
          where: { project_id: body.project_id, facility_group_id: facilityGroup.id },
        });
        await projectFacilityGroup.applyUnassigedToResources();
        await db.ProjectFacilityGroup.destroy({ where: { project_id: body.project_id, facility_group_id: facilityGroup.id } });
      }
    }
    console.log("-------", isGroupInProgram);
  } catch (error) {
    console.log(error);
    return { messege: error };
  }
};
const bulkProjectUpdate = async (req, res) => {
  try {
    const qs = require("qs");
    const body = qs.parse(req.body);
    const facilityIds = body.facility_group_ids;
    const project = await db.Project.findByPk(body.program_id);
    console.log("Project---", project);
    const facilityGroups = await db.FacilityGroup.findAll({ where: { id: facilityIds } });
    await project.setFacilityGroups(facilityGroups);
    return { facility_groups: facilityGroups };
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};          
const duplicateToPrograms = async (req, res) => {
  try {
    const qs = require("qs");
    const body = qs.parse(req.body);
    const sourceProgram = await db.Project.findByPk(body.source_program_id);
    const targetProgram = await db.Project.findOne({
      includes: [
        {
          model: db.FacilityGroup,
        },
      ],
      where: { id: body.target_program_id },
    });
    const sourcFacilityGroup = await db.FacilityGroup.findByPk(body.facility_group_id);
    if (sourcFacilityGroup.is_default) {
      return { message: "Cant duplicate default group" };
    }
    let targetFacilityGroup = sourcFacilityGroup;
    const sourceFacilityData = sourcFacilityGroup.get({ plain: true });
    const duplicateSourceFacilityData = {
      ...sourceFacilityData,
      name: `${sourcFacilityGroup.name} - Copy`,
      is_default: false,
      is_portfolio: false,
    };
    delete duplicateSourceFacilityData.id;
    const duplicateFacilityGroup = await db.FacilityGroup.create(duplicateSourceFacilityData);
    await targetProgram.addFacilityGroup(duplicateFacilityGroup);
    targetFacilityGroup = duplicateFacilityGroup;
    const allFacilityProjects = await db.FacilityProject.findAll({
      where: { project_id: sourceProgram.id, facility_group_id: sourcFacilityGroup.id },
    });
    const failedFacilityProjs = [];
    for (fp of allFacilityProjects) {
      const result = await fp.duplicateToProgram(targetProgram.id, targetFacilityGroup.id);
      if (!result.status) {
        failedFacilityProjs.push(result);
      }
    }
    if (failedFacilityProjs.length) {
      return { data: failedFacilityProjs, message: "Fail to move all projects from given group" };
    } else {
      return { message: "Facility group projects are moved to program" };
    }
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};
const moveToProgram = async (req, res) => {
  try {
    const qs = require("qs");
    const body = qs.parse(req.body);
    const sourceProgram = await db.Project.findByPk(body.source_program_id);
    const targetProgram = await db.Project.findOne({
      includes: [
        {
          model: db.FacilityGroup,
        },
      ],
      where: { id: body.target_program_id },
    });
    const sourcFacilityGroup = await db.FacilityGroup.findByPk(body.facility_group_id);
    if (sourcFacilityGroup.is_default) {
      return { message: "Can't move default group" };
    }
    const isGroupInProgram = await targetProgram.hasFacilityGroup(sourcFacilityGroup);
    if (!isGroupInProgram) {
      await targetProgram.addFacilityGroup(sourcFacilityGroup);
    }
    const allFacilityProjects = await db.FacilityProject.findAll({
      wherr: { project_id: sourceProgram.id, facility_group_id: sourcFacilityGroup.id },
    });
    let failedFacilityProjs = [];
    for (fp of allFacilityProjects) {
      const result = await fp.moveToProgram(targetProgram.id, body.target_facility_group_id);
      if (result.status !== true) {
        failedFacilityProjs.push(result);
      }
    }
    const sourceProjectFacilityGroup = await db.ProjectFacilityGroup.findOne({ where: { facility_group_id: sourcFacilityGroup.id } });
    if (sourceProjectFacilityGroup) {
      await sourceProjectFacilityGroup.destroy();
    }
    if (failedFacilityProjs.length > 0) {
      return { message: "Fail to move all projects from given group", data: failedFacilityProjs };
    } else {
      return { message: "Facility group projects are moved to facility programs" };
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  index,
  create,
  update,
  destroy,
  bulkProjectUpdate,
  duplicateToPrograms,
  moveToProgram,
};
