const { db } = require("../database/models");
const { getCurrentUser } = require("../utils/helpers");
const { _ } = require("lodash");
const { fn, Op, Model, QueryTypes } = require("sequelize");

const allIssueAssociations = [
  { model: db.IssueType },
  { model: db.TaskType },
  { model: db.IssueUser },
  { model: db.User, include: [{ model: db.Organization }] },
  { model: db.IssueStage },
  { model: db.Checklist, as: "listable", include: [{ model: db.User }, { model: db.ProgressList, include: [{ model: db.User }] }] },
  { model: db.Note, include: [{ model: db.User }] },
  { model: db.RelatedTask },
  { model: db.RelatedIssue },
  { model: db.RelatedRisk },
  { model: db.Project },
  //   { model: db.Facility },
  //   { model: db.FacilityGroup },
  { model: db.FacilityProject, include: [{ model: db.Facility }, { model: db.Status }] },
  { model: db.IssueSeverity },
];
const allLessonAssociations = [
  { model: db.TaskType },
  { model: db.LessonDetail, include: [{ model: db.User }] },
  { model: db.LessonUser },
  { model: db.LessonStage },
  { model: db.RelatedTask },
  { model: db.RelatedIssue },
  { model: db.RelatedRisk },
  { model: db.Note, include: [{ model: db.User }] },
  { model: db.User, include: [{ model: db.Organization }] },
  //   { model: db.LessonFile, as: "lesson_files_attachments", include: [{ model: Attachment, as: "blob" }] },
  //   { model: SubTask, as: "sub_tasks", include: [{ model: Facility, as: "facility" }] },
  //   { model: SubIssue, as: "sub_issues", include: [{ model: Facility, as: "facility" }] },
  //   { model: SubRisk, as: "sub_risks", include: [{ model: Facility, as: "facility" }] },
  { model: db.Project },
  { model: db.FacilityProject, include: [{ model: db.Facility }], as: "FacilityProjects" },
];
const allRiskAssociations = [
  { model: db.TaskType },
  { model: db.RiskUser },
  { model: db.User, include: [{ model: db.Organization }] },
  //   { modle: db.RiskStage },
  { model: db.Checklist, as: "listable", include: [{ model: db.ProgressList, include: [{ model: db.User }] }] },
  { model: db.Note, include: [{ model: db.User }] },
  { model: db.RelatedTask },
  { model: db.RelatedIssue },
  { model: db.RelatedRisk },
  { model: db.Project },
  //   { model: db.Facility },
  //   { model: db.FacilityGroup },
  { model: db.FacilityProject, as: "RiskFacilityProject", include: [{ model: db.Facility }, { model: db.Status }] },
];
const allTaskAssociations = [
  { model: db.TaskType },
  { model: db.TaskUser },
  { model: db.TaskStage },
  { model: db.Checklist, as: "listable", include: [{ model: db.ProgressList, include: [{ model: db.User }] }] },
  { model: db.Note, include: [{ model: db.User }] },
  { model: db.User, include: [{ model: db.Organization }] },
  { model: db.RelatedTask },
  { model: db.RelatedIssue },
  { model: db.RelatedRisk },
  //   { model: db.FacilityGroup },
  //   { model: db.ContractFacilityGroup },
  { model: db.ProjectContract },
  { model: db.Facility },
  { model: db.FacilityProject, as: "TaskFacilityProject", include: [{ model: db.Facility }, { model: db.Status }] },
];
const tabCounts = async (req, res) => {
  try {
    const responseHash = {};
    const current_user = await getCurrentUser(req.headers["x-token"]);
    const role_ids = await getRolIds(current_user);
    const facProjIdWithProjTasks = await getFacProjIdsWithRoleType(role_ids, current_user, "project_tasks");
    const facProjIdsWithProjIssues = await getFacProjIdsWithRoleType(role_ids, current_user, "project_issues");
    const facProjIdsWithProjRisks = await getFacProjIdsWithRoleType(role_ids, current_user, "project_risks");
    const facProjIdsWithProjLessons = await getFacProjIdsWithRoleType(role_ids, current_user, "project_lessons");
    console.log(facProjIdWithProjTasks, facProjIdsWithProjIssues, facProjIdsWithProjRisks, facProjIdsWithProjLessons);
    responseHash.issuesCount = await db.Issue.unscoped().count({
      where: {
        facility_project_id: {
          [Op.in]: facProjIdsWithProjIssues,
        },
      },
    });
    responseHash.tasksCount = await db.Task.unscoped().count({
      where: {
        facility_project_id: {
          [Op.in]: facProjIdWithProjTasks,
        },
      },
    });
    responseHash.risksCount = await db.Risk.unscoped().count({
      where: {
        facility_project_id: {
          [Op.in]: facProjIdsWithProjRisks,
        },
      },
    });
    responseHash.lessonsCount = await db.Lesson.unscoped().count({
      where: {
        facility_project_id: {
          [Op.in]: facProjIdsWithProjLessons,
        },
      },
    });
    return { responseHash: responseHash };
  } catch (error) {
    console.log(error);
  }
};
const issues = async (req, res) => {
  try {
    let responseHash = {};
    let allResources = null;
    const current_user = await getCurrentUser(req.headers["x-token"]);
    const role_ids = await getRolIds(current_user);
    const facProjIdsWithProjIssues = await getFacProjIdsWithRoleType(role_ids, current_user, "project_issues");
    if (req.query.pagination === "true") {
      console.log("Test true");
      const perPage = parseInt(req.query.per_page);
      const page = parseInt(req.query.page);
      allResources = await db.Issue.unscoped().findAndCountAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjIssues },
        },
        include: allIssueAssociations,
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      responseHash.issues = allResources.rows.map((resource) => resource.toJSON());
      responseHash.totalCount = allResources.count;
      responseHash.nextPage = page * perPage < responseHash.totalCount ? page + 1 : null;
      responseHash.currentPage = page;
      responseHash.previousPage = page > 1 ? page - 1 : null;
      responseHash.totalPages = Math.ceil(responseHash.totalCount / perPage);
    } else {
      allResources = await db.Issue.unscoped().findAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjIssues },
        },
        include: allIssueAssociations,
      });
      responseHash.issues = allResources.map((resource) => resource.toJSON());
      responseHash.totalCount = responseHash.issues.length;
      responseHash.nextPage = null;
      responseHash.currentPage = null;
      responseHash.previousPage = null;
      responseHash.totalPages = null;
    }
    return { responseHash: responseHash };
  } catch (error) {
    console.log(error);
  }
};
const lessons = async (req, res) => {
  try {
    const responseHash = {};
    let allResources = null;
    const current_user = await getCurrentUser(req.headers["x-token"]);
    const role_ids = await getRolIds(current_user);
    const facProjIdsWithProjLessons = await getFacProjIdsWithRoleType(role_ids, current_user, "project_lessons");
    if (req.query.pagination === "true") {
      const perPage = parseInt(req.query.per_page);
      const page = parseInt(req.query.page);
      allResources = await db.Lesson.unscoped().findAndCountAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjLessons },
        },
        include: allLessonAssociations,
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      responseHash.lessons = allResources.rows.map((resource) => resource.toJSON());
      responseHash.totalCount = allResources.count;
      responseHash.nextPage = page * perPage < responseHash.totalCount ? page + 1 : null;
      responseHash.currentPage = page;
      responseHash.previousPage = page > 1 ? page - 1 : null;
      responseHash.totalPages = Math.ceil(responseHash.totalCount / perPage);
    } else {
      allResources = await db.Lesson.unscoped().findAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjLessons },
        },
        include: allLessonAssociations,
      });
      responseHash.lessons = allResources.map((resource) => resource.toJSON());
      responseHash.totalCount = responseHash.lessons.length;
      responseHash.nextPage = null;
      responseHash.currentPage = null;
      responseHash.previousPage = null;
      responseHash.totalPages = null;
    }
    return { responseHash: responseHash };
  } catch (error) {
    console.log(error);
  }
};

const tasks = async (req, res) => {
  try {
    const responseHash = {};
    let allResources = null;
    const current_user = await getCurrentUser(req.headers["x-token"]);
    const role_ids = await getRolIds(current_user);
    const facProjIdsWithProjTasks = await getFacProjIdsWithRoleType(role_ids, current_user, "project_tasks");
    if (req.query.pagination === "true") {
      const perPage = parseInt(req.query.per_page);
      const page = parseInt(req.query.page);
      allResources = await db.Task.unscoped().findAndCountAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjTasks },
        },
        include: allTaskAssociations,
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      responseHash.tasks = allResources.rows.map((resource) => resource.toJSON());
      responseHash.totalCount = allResources.count;
      responseHash.nextPage = page * perPage < responseHash.totalCount ? page + 1 : null;
      responseHash.currentPage = page;
      responseHash.previousPage = page > 1 ? page - 1 : null;
      responseHash.totalPages = Math.ceil(responseHash.totalCount / perPage);
    } else {
      allResources = await db.Task.unscoped().findAndCountAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjTasks },
        },
        include: allLessonAssociations,
      });
      responseHash.tasks = allResources.map((resource) => resource.toJSON());
      responseHash.totalCount = responseHash.tasks.length;
      responseHash.nextPage = null;
      responseHash.currentPage = null;
      responseHash.previousPage = null;
      responseHash.totalPages = null;
    }
    return { responseHash: responseHash };
  } catch (error) {
    console.log(error);
  }
};

const risks = async (req, res) => {
  try {
    const responseHash = {};
    let allResources = null;
    const current_user = await getCurrentUser(req.headers["x-token"]);
    const role_ids = await getRolIds(current_user);
    const facProjIdsWithProjRisks = await getFacProjIdsWithRoleType(role_ids, current_user, "project_risks");
    console.log("Ider he ata hai na?");
    if (req.query.pagination === "true") {
      const perPage = parseInt(req.query.per_page);
      const page = parseInt(req.query.page);
      allResources = await db.Risk.unscoped().findAndCountAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjRisks },
        },
        include: allRiskAssociations,
      });
      responseHash.risks = allResources.rows.map((resource) => resource.toJSON());
      responseHash.totalCount = allResources.count;
      responseHash.nextPage = page * perPage < responseHash.totalCount ? page + 1 : null;
      responseHash.currentPage = page;
      responseHash.previousPage = page > 1 ? page - 1 : null;
      responseHash.totalPages = Math.ceil(responseHash.totalCount / perPage);
      return { responseHash: responseHash };
    } else {
      allResources = await db.Risk.unscoped().findAndCountAll({
        where: {
          facility_project_id: { [Op.in]: facProjIdsWithProjRisks },
        },
        include: allRiskAssociations,
      });
      responseHash.risks = allResources.map((resource) => resource.toJSON());
      responseHash.totalCount = responseHash.risks.length;
      responseHash.nextPage = null;
      responseHash.currentPage = null;
      responseHash.previousPage = null;
      responseHash.totalPages = null;
    }
  } catch (error) {
    console.log(error);
  }
};

async function getFacProjIdsWithRoleType(role_ids, current_user, role_type) {
  const rolePrivilages = await db.RolePrivilege.findAll({
    where: {
      role_id: role_ids,
      privilege: {
        [Op.regexp]: "^[RWD]",
      },
      role_type: role_type,
    },
  });
  let rolePriviligeRoleIds = _.compact(
    _.uniq(
      _.map(rolePrivilages, function (f) {
        return f.role_id;
      })
    )
  );
  let roleUsers2 = await db.RoleUser.findAll({ where: { user_id: current_user.id, role_id: rolePriviligeRoleIds } });
  const facilityProjectIdWithProjectTasks = _.compact(
    _.uniq(
      _.map(roleUsers2, function (f) {
        return f.role_id;
      })
    )
  );
  return facilityProjectIdWithProjectTasks;
}

async function getRolIds(current_user) {
  const autherizedData = await current_user.getAuthorizedData();
  const allFacilityProjectIds = autherizedData.authorized_facility_project_ids;
  const roleUsers = await db.RoleUser.findAll({
    where: {
      user_id: current_user.id,
      facility_project_id: allFacilityProjectIds,
    },
  });
  let role_ids = _.compact(
    _.uniq(
      _.map(roleUsers, function (f) {
        return f.role_id;
      })
    )
  );
  return role_ids;
}

module.exports = {
  tabCounts,
  issues,
  lessons,
  tasks,
  risks,
};
