const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser } = require("../utils/helpers.js");
const { Op } = require("sequelize");
const show = async (req, res) => {
  try {
    let issue = await db.Issue.findOne({
      attributes: [
        "id",
        "title",
        "description",
        "issue_type_id",
        "issue_severity_id",
        "facility_project_id",
        "start_date",
        "due_date",
        "progress",
        "auto_calculate",
        "watched",
        "watched_at",
        "issue_stage_id",
        "kanban_order",
        "task_type_id",
        "important",
        "draft",
        "on_hold",
        "reportable",
        "contract_id",
        "project_contract_id",
        "project_contract_vehicle_id",
        "owner_id",
        "owner_type",
      ],
      where: { id: req.params.id },
    });

    console.log("Issue-Show: ", issue);
    return { issue: await issue.toJSON() };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching issue " + error };
  }
};

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require("qs");
    console.log("issue body", req.body);
    console.log("issue params", req.params);
    let params = qs.parse(req.body);
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    let issue = db.Issue.build();
    let user = await getCurrentUser(req.headers["x-token"]);
    await issue.createOrUpdateIssue(params, { user: user, project_id: req.params.program_id, facility_id: req.params.project_id });
    return { issue: await issue.toJSON(), msg: "Issue created successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching issue " + error };
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require("qs");
    console.log("issue params", qs.parse(req.body));
    let params = qs.parse(req.body);
    let issueParams = params;

    let issue = await db.Issue.findOne({
      attributes: [
        "id",
        "title",
        "description",
        "issue_type_id",
        "issue_severity_id",
        "facility_project_id",
        "start_date",
        "due_date",
        "progress",
        "auto_calculate",
        "watched",
        "watched_at",
        "issue_stage_id",
        "kanban_order",
        "task_type_id",
        "important",
        "draft",
        "on_hold",
        "reportable",
        "contract_id",
        "project_contract_id",
        "project_contract_vehicle_id",
        "owner_id",
        "owner_type",
      ],
      where: { id: req.params.id },
    });
    issue.set(issueParams);
    console.log("Update-Issue: ", issue);
    await issue.save();
    console.log("hi-issue: ");
    await issue.assignUsers(params);
    await issue.manageNotes(issueParams);
    await issue.manageChecklists(issueParams);
    await issue.addResourceAttachment(params);
    console.log("Updated-Issue: ", issue);
    return { issue: await issue.toJSON(), msg: "Issue updated successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching issue " + error };
  }
};

const destroy = async (req, res) => {
  try {
    var qs = require("qs");
    const params = qs.parse(req.params);
    console.log("Params:-----", params.id);
    const issue = await db.Issue.findOne({
      attributes: [
        "id",
        "title",
        "description",
        "issue_type_id",
        "issue_severity_id",
        "facility_project_id",
        "start_date",
        "due_date",
        "progress",
        "auto_calculate",
        "watched",
        "watched_at",
        "issue_stage_id",
        "kanban_order",
        "task_type_id",
        "important",
        "draft",
        "on_hold",
        "reportable",
        "contract_id",
        "project_contract_id",
        "project_contract_vehicle_id",
        "owner_id",
        "owner_type",
      ],
      where: { id: params.id },
    });
    console.log("Deleted Issue: ", issue);
    await issue.destroy();
    return { msg: "Issue destroyed succecfully" };
  } catch (error) {
    return { error: "Error in issue destroy" };
  }
};
const index = async (req, res) => {
  const qs = require("qs");
  try {
    const params = qs.parse(req.params);
    const page = req.query.page || 1;
    const perPage = 15;
    console.log("Params--ss--:", params);
    // Fetch all issues with the necessary associations
    const { count, rows: allIssues } = await db.Issue.findAndCountAll({
      attributes: [
        "id",
        "title",
        "description",
        "issue_type_id",
        "issue_severity_id",
        "facility_project_id",
        "start_date",
        "due_date",
        "progress",
        "auto_calculate",
        "watched",
        "watched_at",
        "issue_stage_id",
        "kanban_order",
        "task_type_id",
        "important",
        "draft",
        "on_hold",
        "reportable",
        "contract_id",
        "project_contract_id",
        "project_contract_vehicle_id",
        "owner_id",
        "owner_type",
      ],
      include: [
        //{ model: db.Attachment, as: "issue_files_attachments", include: "blob" },
        { model: db.IssueType },
        { model: db.TaskType },
        { model: db.IssueUser, include: db.User },
        { model: db.User, include: db.Organization },
        { model: db.IssueStage },
        { model: db.Checklist, as: "listable", include: [{ model: db.User }, { model: db.ProgressList, include: db.User }] },
        { model: db.Note, include: db.User },
        { model: db.RelatedTask },
        { model: db.RelatedIssue },
        { model: db.RelatedRisk },
        // { model: SubTask },
        // { model: SubIssue },
        // { model: SubRisk },
        {
          model: db.FacilityProject,
        },
        { model: db.IssueSeverity },
      ],
      where: {
        [Op.or]: [
          { facility_project_id: params.project_id },
          { project_contract_id: params.project_id },
          { project_contract_vehicle_id: params.project_id },
        ],
      },
      limit: perPage,
      offset: (page - 1) * perPage,
    });
    console.log("All-Issues:--", allIssues);
    // Get all issue users
    const issueUserIds = allIssues.map((issue) => issue.id);
    console.log("issueUserIds---", issueUserIds);
    const allIssueUsers = await db.IssueUser.findAll({
      where: { issue_id: issueUserIds },
      attributes: ["issue_id", "user_id"],
    });
    console.log("allIssueUsers---", allIssueUsers);
    // Extract user IDs
    const allUserIds = allIssueUsers.map((issueUser) => issueUser.user_id);
    const uniqueUserIds = [...new Set(allUserIds)];
    console.log("uniqueUserIds---", uniqueUserIds);
    // // Get all users and their organizations
    const allUsers = await db.User.findAll({
      where: { id: allUserIds },
      include: db.Organization,
    });
    console.log("allUsers---", allUsers);
    const allOrganizationIds = allUsers.map((user) => user.organization_id).filter(Boolean);
    const allOrganizations = await db.Organization.findAll({
      where: { id: allOrganizationIds },
    });
    console.log("allOrganizations---", allOrganizations);
    // // Prepare the response
    const issuesJson = await Promise.all(
      allIssues.map(async (issue) => {
        const issueData = issue.toJSON();
        return {
          ...issueData,
          organizations: allOrganizations,
          all_issue_users: allIssueUsers.filter((iu) => iu.issue_id === issue.id),
          all_users: allUsers,
        };
      })
    );
    console.log("IssueJson---: ", issuesJson);
    return {
      issues: issuesJson,
      total_pages: Math.ceil(count / perPage),
      current_page: page,
      next_page: page < Math.ceil(count / perPage) ? page + 1 : null,
    };
  } catch (error) {
    console.log(error);
    console.error("Error fetching issues:", error);
    // res.status(500).json({ error: "Internal Server Error" });
  }
};
const create_duplicate = async (req, res) => {
  try {
    const qs = require("qs");
    const params = qs.parse(req.params);
    const existing_issue = await db.Issue.findOne({
      attributes: [
        "id",
        "title",
        "description",
        "issue_type_id",
        "issue_severity_id",
        "facility_project_id",
        "start_date",
        "due_date",
        "progress",
        "auto_calculate",
        "watched",
        "watched_at",
        "issue_stage_id",
        "kanban_order",
        "task_type_id",
        "important",
        "draft",
        "on_hold",
        "reportable",
        "contract_id",
        "project_contract_id",
        "project_contract_vehicle_id",
        "owner_id",
        "owner_type",
      ],
      where: { id: params.id },
    });
    const issueData = existing_issue.get({ plain: true });
    console.log("Issue-Data: ", issueData);
    delete issueData.id;
    issueData.title = `${issueData.title}-Copy`;
    // let user = await getCurrentUser(req.headers["x-token"]);
    // let issue = db.Issue.build();
    const duplicateIssue = await createIssue(req, issueData);
    // const duplicateIssue = await issue.createOrUpdateIssue(issueData, { user: user, project_id: params.program_id, facility_id: params.project_id });
    console.log("Issue------", duplicateIssue);
    return { issue: await duplicateIssue.toJSON(), msg: "Duplicate issue created successfully" };
  } catch (error) {
    return { error: "Duplicate issue not created successfully" };
  }
};
const create_bulk_duplicate = async (req, res) => {
  try {
    const qs = require("qs");
    const params = qs.parse(req.params);
    let allObjs = [];
    const { facility_project_ids, project_contract_ids, project_contract_vehicle_ids } = req.body;
    const existing_issue = await db.Issue.findOne({
      attributes: [
        "id",
        "title",
        "description",
        "issue_type_id",
        "issue_severity_id",
        "facility_project_id",
        "start_date",
        "due_date",
        "progress",
        "auto_calculate",
        "watched",
        "watched_at",
        "issue_stage_id",
        "kanban_order",
        "task_type_id",
        "important",
        "draft",
        "on_hold",
        "reportable",
        "contract_id",
        "project_contract_id",
        "project_contract_vehicle_id",
        "owner_id",
        "owner_type",
      ],
      where: { id: params.id },
    });
    const issueData = existing_issue.get({ plain: true });
    const duplicateAndSave = async (field, values) => {
      for (let value of values) {
        //const issueData = { ...issueData };
        delete issueData.id;
        issueData[field] = value;
        issueData.title = `${issueData.title}-Copy`;
        issueData.createdAt = new Date();
        issueData.updatedAt = new Date();
        const bulkDuplicateIssue = await createIssue(req, issueData);
        allObjs.push(bulkDuplicateIssue);
      }
    };
    if (facility_project_ids) {
      await duplicateAndSave("facility_project_id", facility_project_ids);
    }
    if (project_contract_ids) {
      await duplicateAndSave("project_contract_id", project_contract_ids);
    }
    if (project_contract_vehicle_ids) {
      await duplicateAndSave("project_contract_vehicle_id", project_contract_vehicle_ids);
    }
    const toJsonIssues = allObjs.map((issue) => issue.dataValues);
    return { issues: toJsonIssues };
  } catch (error) {}
};
const createIssue = async (req, issueData) => {
  let user = await getCurrentUser(req.headers["x-token"]);
  let issue = db.Issue.build();
  return await issue.createOrUpdateIssue(issueData, { user: user, project_id: req.params.program_id, facility_id: req.params.project_id });
};
const batch_update = async (req, res) => {
  try {
    const qs = require("qs");
    const allIsues = req.body;
    console.log("Allissues:--", allIsues);
    for (let issue of allIsues) {
      const getIssue = await db.Issue.findOne({
        attributes: [
          "id",
          "title",
          "description",
          "issue_type_id",
          "issue_severity_id",
          "facility_project_id",
          "start_date",
          "due_date",
          "progress",
          "auto_calculate",
          "watched",
          "watched_at",
          "issue_stage_id",
          "kanban_order",
          "task_type_id",
          "important",
          "draft",
          "on_hold",
          "reportable",
          "contract_id",
          "project_contract_id",
          "project_contract_vehicle_id",
          "owner_id",
          "owner_type",
        ],
        where: { id: issue.id },
      });
      getIssue.set(issue);
      await getIssue.save();
      console.log(
        await db.Issue.findAll({
          attributes: [
            "id",
            "title",
            "description",
            "issue_type_id",
            "issue_severity_id",
            "facility_project_id",
            "start_date",
            "due_date",
            "progress",
            "auto_calculate",
            "watched",
            "watched_at",
            "issue_stage_id",
            "kanban_order",
            "task_type_id",
            "important",
            "draft",
            "on_hold",
            "reportable",
            "contract_id",
            "project_contract_id",
            "project_contract_vehicle_id",
            "owner_id",
            "owner_type",
          ],
        })
      );
    }
    return { msg: "Issues updated Successfully" };
  } catch (error) {
    return { error: "Error updating batch issues" };
  }
};
module.exports = {
  update,
  show,
  create,
  destroy,
  index,
  create_duplicate,
  create_bulk_duplicate,
  batch_update,
};
