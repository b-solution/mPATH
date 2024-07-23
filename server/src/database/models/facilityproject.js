"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FacilityProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.Facility, { foreignKey: "facility_id", onDelete: "CASCADE" });
      this.belongsTo(models.Project, { foreignKey: "project_id", onDelete: "CASCADE" });
      this.belongsTo(models.Status);
      this.hasMany(models.Task, { foreignKey: "facility_project_id" });
      // // this.belongsToMany(models.TaskType,{through: models.Task, foreignKey: '', otherKey: '' });
      this.belongsTo(models.Issue, { foreignKey: "issue_id" });
      this.hasMany(models.Risk, { foreignKey: "facility_project_id" });
      this.hasMany(models.Lesson, { foreignKey: "facility_project_id" });
      this.hasMany(models.Note, {
        foreignKey: "noteable_id",
        constraints: false,
        scope: {
          noteable_type: "FacilityProject",
        },
      }); // this.hasMany(models.FacilityPrivilege);
      this.belongsTo(models.FacilityGroup, { foreignKey: "facility_group_id" });
      // this.hasMany(models.Effort)
    }
    async duplicateToProgram(targetProgramId, targetFacilityGroupId = null) {
      const { db } = require("./index.js");
      console.log("Hi Dup----", targetProgramId);
      try {
        const facility = await this.getFacility();
        console.log("Facility---", facility.get({ plain: true }));
        const targetProgram = await db.Project.findByPk(targetProgramId);
        console.log("TargetProgram--", targetProgram);
        if (!targetProgram) {
          throw new Error("Target program not found");
        }
        const facilityData = facility.get({ plain: true });
        const duplicateFacilityData = {
          ...facilityData,
          is_portfolio: false,
          facility_name: `${facility.facility_name} - Copy`,
          project_id: targetProgram.id,
        };
        delete duplicateFacilityData.id;
        const duplicateFacility = await db.Facility.create(duplicateFacilityData);
        const facilityProj = await db.FacilityProject.findOne({
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
          where: { facility_id: facilityData.id },
        });
        const facilityProjectData = facilityProj.get({
          plain: true,
        });
        const duplicateFacilityProjectData = {
          ...facilityProjectData,
          project_id: targetProgram.id,
          facility_id: duplicateFacility.id,
          facility_group_id: targetFacilityGroupId,
          color: "#ff",
        };
        //delete duplicateFacilityProjectData.id;
        const duplicateFacilityProject = await db.FacilityProject.create(duplicateFacilityProjectData);
        const dupFacId = await db.FacilityProject.findOne({ attributes: ["id"], where: { facility_id: duplicateFacilityProject.facility_id } });
        console.log(dupFacId.id);
        const tasks = await this.getTasks();
        console.log("Tasks--", tasks);
        const risks = await this.getRisks();
        console.log("Risks--", risks);
        console.log("FacilityDaa--", facilityData);
        const issues = await db.Issue.findAll({
          where: { facility_project_id: facilityData.id },
        });
        console.log("Issues---F", issues);
        const lessons = await this.getLessons();
        console.log("Lessons--F", lessons);
        const notes = await this.getNotes();
        console.log("Notes--F", notes);
        // console.log("Tasks---", tasks, notes, issues, lessons, risks);

        for (const task of tasks) {
          const duplicateTaskData = {
            ...task.get({ plain: true }),
            facility_project_id: dupFacId.id,
          };
          delete duplicateTaskData.id;
          const duplicateTask = await db.Task.create(duplicateTaskData);
          console.log("DuplicatedTask---", duplicateTask);
        }
        for (const risk of risks) {
          console.log("hello ris");
          const duplicateRiskData = {
            ...risk.get({ plain: true }),
            facility_project_id: dupFacId.id,
          };
          delete duplicateRiskData.id;
          await db.Risk.create(duplicateRiskData);
        }
        for (const issue of issues) {
          const duplicateIssueData = {
            ...issue.get({ plain: true }),
            facility_project_id: dupFacId.id,
          };
          delete duplicateIssueData.id;
          const duplicateIssue = await db.Issue.create(duplicateIssueData);
          console.log("DuplicatedIssue---", duplicateIssue);
        }
        for (const lesson of lessons) {
          const duplicatLessonData = {
            ...lesson.get({ plain: true }),
            facility_project_id: dupFacId.id,
          };
          delete duplicatLessonData.id;
          console.log("duplicatLessonData", duplicatLessonData);
          await db.Lesson.create(duplicatLessonData);
        }
        for (const note of notes) {
          const duplicatNoteData = {
            ...note.get({ plain: true }),
            facility_project_id: dupFacId.id,
          };
          delete duplicatNoteData.id;
          await db.Note.create(duplicatNoteData);
        }

        //await transaction.commit();

        return { facility_project_id: dupFacId.id, message: "Project duplicated successfully", status: true };
      } catch (error) {
        //await transaction.rollback();
        return { facility_project_id: this.id, message: error.message, status: false };
      }
    }

    async moveToProgram(targetProgramId, targetFacilityGroupId = null) {
      const { db } = require("./index.js");
      try {
        // Assuming `this` is the facilityProject instance
        const FacProjId = await db.FacilityProject.findOne({
          attributes: ["id"],
          where: { facility_id: this.facility_id },
        });
        const sourceProgram = await this.getProject();
        const targetProgram = await db.Project.findByPk(targetProgramId);
        // Find role users with portfolio roles
        const portfolioRoleRoleUsers = await db.RoleUser.findAll({
          where: {
            project_id: sourceProgram.id,
            facility_project_id: FacProjId.id,
          },
          include: [
            {
              model: db.Role,
              where: {
                is_default: true,
                is_portfolio: true,
              },
            },
          ],
        });
        // Find role users with program-specific roles
        const programSpecificRoleRoleUsers = await db.RoleUser.findAll({
          where: {
            project_id: sourceProgram.id,
            facility_project_id: FacProjId.id,
          },
          include: [
            {
              model: db.Role,
              where: {
                project_id: sourceProgram.id,
              },
            },
          ],
        });
        const projectUser = await db.ProjectUser.findAll({ where: { project_id: targetProgram.id } });
        // Add users to the target program
        const userIds = Array.from(
          new Set([
            ...projectUser.map((user) => user.user_id),
            ...portfolioRoleRoleUsers.map((user) => String(user.user_id)),
            ...programSpecificRoleRoleUsers.map((user) => String(user.user_id)),
          ])
        );
        await db.ProjectUser.destroy({ where: { project_id: targetProgram.id } });
        await db.ProjectUser.bulkCreate(
          userIds.map((uid) => {
            return { user_id: uid, project_id: targetProgram.id };
          })
        );
        // Update project_id for portfolio role users
        await db.RoleUser.update(
          { project_id: targetProgram.id },
          {
            where: {
              id: portfolioRoleRoleUsers.map((user) => user.id),
            },
          }
        );
        // Create new project level roles
        const otherRoles = await db.Role.findAll({
          where: {
            id: programSpecificRoleRoleUsers.map((user) => user.role_id),
          },
        });

        const dupOtherRoles = {};
        for (const otherRole of otherRoles) {
          const otherRoleData = {
            ...otherRole.get({ plain: true }),
            project_id: targetProgram.id,
            name: `${otherRole.name} - copy of role#${otherRole.id}`,
            user_id: null,
          };
          console.log("OtherRoleData---", otherRoleData);
          delete otherRoleData.id;
          const newRole = await db.Role.create(otherRoleData);
          console.log("new role---", newRole);
          dupOtherRoles[otherRole.id] = newRole.id;
          console.log("dupOtherRoles[otherRole.id]--", dupOtherRoles[otherRole.id]);
        }
        // Assign new project level roles to target users
        for (const roleUser of programSpecificRoleRoleUsers) {
          roleUser.role_id = dupOtherRoles[roleUser.role_id];
          roleUser.project_id = targetProgram.id;
          await roleUser.save();
        }
        // Update facility project
        this.project_id = targetProgram.id;
        if (targetFacilityGroupId) {
          this.facility_group_id = targetFacilityGroupId;
        }
        await this.save();
        return { facility_project_id: FacProjId.id, message: "Project moved successfully", status: true };
      } catch (error) {
        // return { facilityProjectId: facilityProject.id, message: error.message, status: false };
      }
    }
  }
  FacilityProject.init(
    {
      // FacilityId:{
      //   type: DataTypes.INTEGER,
      //   field: 'facility_id'
      // },
      facility_id: DataTypes.INTEGER,
      // ProjectId:{
      //   type: DataTypes.INTEGER,
      //   field: 'project_id'
      // },
      project_id: DataTypes.INTEGER,
      due_date: DataTypes.DATE,
      // StatusId: {
      //   type: DataTypes.INTEGER,
      //   field: 'status_id'
      // },
      status_id: DataTypes.INTEGER,
      progress: DataTypes.INTEGER,
      color: DataTypes.STRING,
      // FacilityGroupId: {
      //   type: DataTypes.INTEGER,
      //   field: 'facility_group_id'
      // },
      facility_group_id: DataTypes.INTEGER,
      // ProjectFacilityGroupId: {
      //   type: DataTypes.INTEGER,
      //   field: 'project_facility_group_id'
      // }
      project_facility_group_id: DataTypes.INTEGER,
      issue_id: DataTypes.INTEGER,
      lesson_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "facility_projects",
      modelName: "FacilityProject",
      underscored: true,
    }
  );
  return FacilityProject;
};
