"use strict";
const { _ } = require("lodash");
const { Readable } = require("stream");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.TaskType);
      this.belongsTo(models.TaskStage);
      this.hasMany(models.TaskUser, { foreignKey: "task_id", onDelete: "CASCADE", hooks: true });
      this.belongsToMany(models.User, { through: models.TaskUser, foreignKey: "task_id", otherKey: "user_id" });
      // // this.hasMany(models.TaskFile);
      this.hasMany(models.Note, {
        foreignKey: "noteable_id",
        constraints: false,
        scope: {
          noteable_type: "Task",
        },
      });
      // this.hasMany(models.Effort)

      this.belongsTo(models.FacilityProject, { foreignKey: "facility_project_id", onDelete: "CASCADE", as: "TaskFacilityProject" });
      this.belongsToMany(models.Facility, { through: models.FacilityProject, foreignKey: "facility_id" });
      // this.belongsTo(models.Contract);
      this.belongsTo(models.ProjectContract, { foreignKey: "project_contract_id" });
      this.belongsTo(models.ProjectContractVehicle);
      this.hasMany(models.Checklist, { as: "listable", foreignKey: "listable_id", onDelete: "CASCADE", hooks: true });
      this.hasMany(models.RelatedTask, {
        foreignKey: "relatable_id",
        constraints: false,
        scope: {
          relatable_type: "Task",
        },
      });
      this.hasMany(models.RelatedRisk, {
        foreignKey: "relatable_id",
        constraints: false,
        scope: {
          relatable_type: "Task",
        },
      });
      this.hasMany(models.RelatedIssue, {
        foreignKey: "relatable_id",
        constraints: false,
        scope: {
          relatable_type: "Task",
        },
      });
      // this.hasMany(models.RelatedTask);
      // this.hasMany(models.RelatedIssue);
      // this.hasMany(models.RelatedRisk);
      // // this.belongsToMany(models.SubTask,{through: models.RelatedTask, foreignKey: '', otherKey: '' });
      // // this.belongsToMany(models.SubIssue,{through: models.RelatedIssue, foreignKey: '', otherKey: '' });
      // // this.belongsToMany(models.SubRisk,{through: models.RelatedRisk, foreignKey: '', otherKey: '' })
    }
    // static URL_FILENAME_LENGTH = 252
    async createCopy(options = {}) {
      try {
        const { db } = require("./index.js");
        const r = this.get({ raw: true });
        var resource = Object.assign({}, r);
        let checklists = await db.Checklist.findAll({ where: { listable_id: resource.id, listable_type: "Task" } });
        let resourceUsers = await db.TaskUser.findAll({ where: { task_id: resource.id } });

        delete resource.id;

        resource.text = `${resource.text} - Copy`;

        if (options.facilityProjectId) {
          delete resource.facility_project_id;
          delete resource.FacilityProjectId;
          resource.facility_project_id = options.facilityProjectId;
        } else if (options.projectContractId) {
          delete resource.project_contract_id;
          delete resource.ProjectContractId;
          resource.project_contract_id = options.projectContractId;
        } else if (options.projectContractVehicleId) {
          delete resource.project_contract_vehicle_id;
          delete resource.ProjectContractVehicleId;
          resource.project_contract_vehicle_id = options.projectContractVehicleId;
        }

        let newResource = await db.Task.create(resource);

        for (var c of checklists) {
          let cAttributes = c.get({ row: true });
          cAttributes.listable_id = newResource.id;
          delete cAttributes.id;
          await db.Checklist.create(cAttributes);
        }
        for (var tu of resourceUsers) {
          let ruAttributes = tu.get({ row: true });
          ruAttributes.task_id = newResource.id;
          ruAttributes.TaskId = newResource.id;
          console.log("***** ruAttributes", ruAttributes);
          delete ruAttributes.id;
          await db.TaskUser.create(ruAttributes);
        }
        return newResource;
      } catch (error) {
        // Handle the error
        console.error("Error in execution", error);
      }
    }
    async createOrUpdateTask(params, options) {
      try {
        const { db } = require("./index.js");
        let user = options.user;
        let project_id = options.project_id;
        let facility_id = options.facility_id;
        console.log("TASK", params);
        const taskParams = params.task;
        const task = this;
        const tParams = { ...taskParams };
        const user_ids = tParams.user_ids;
        // const subTaskIds = tParams.subTaskIds;
        // const subIssueIds = tParams.subIssueIds;
        // const subRiskIds = tParams.subRiskIds;
        const checklistsAttributes = tParams.checklistsAttributes;
        // const notesAttributes = tParams.notesAttributes;

        if (!tParams.planned_effort) {
          tParams.planned_effort = 0.0;
        }
        if (!tParams.actual_effort) {
          tParams.actual_effort = 0.0;
        }
        console.log("Task-Optons: ", options);
        let facility_project = await db.FacilityProject.findOne({ where: { project_id: project_id, facility_id: facility_id }, raw: true });
        tParams["facility_project_id"] = facility_project.id;
        // console.log("**********tParams", tParams)

        task.setAttributes(tParams);

        if (tParams.project_contract_id) {
          task.project_contract_id = params.project_contract_id;
        } else if (tParams.project_contract_vehicle_id) {
          task.project_contract_vehicle_id = params.project_contract_vehicle_id;
        }

        const allChecklists = await db.Checklist.findAll({ where: { listable_id: task.id, listable_type: "Task" } });

        await task.save();

        await task.assignUsers(params);
        await task.manageNotes(tParams);
        await task.manageChecklists(tParams);
        // if (subTaskIds && subTaskIds.length > 0) {
        //   const relatedTaskObjs = subTaskIds.map((sid) => ({
        //     relatableId: task.id,
        //     relatableType: 'Task',
        //     taskId: sid,
        //   }));
        //   const relatedTaskObjs2 = subTaskIds.map((sid) => ({
        //     relatableId: sid,
        //     relatableType: 'Task',
        //     taskId: task.id,
        //   }));
        //   await RelatedTask.bulkCreate(relatedTaskObjs, { transaction: t });
        //   await RelatedTask.bulkCreate(relatedTaskObjs2, { transaction: t });
        // }

        // if (subIssueIds && subIssueIds.length > 0) {
        //   const relatedIssueObjs = subIssueIds.map((sid) => ({
        //     relatableId: task.id,
        //     relatableType: 'Task',
        //     issueId: sid,
        //   }));
        //   const relatedTaskObjs2 = subIssueIds.map((sid) => ({
        //     relatableId: sid,
        //     relatableType: 'Issue',
        //     taskId: task.id,
        //   }));
        //   await RelatedIssue.bulkCreate(relatedIssueObjs, { transaction: t });
        //   await RelatedTask.bulkCreate(relatedTaskObjs2, { transaction: t });
        // }

        // if (subRiskIds && subRiskIds.length > 0) {
        //   const relatedRiskObjs = subRiskIds.map((sid) => ({
        //     relatableId: task.id,
        //     relatableType: 'Task',
        //     riskId: sid,
        //   }));
        //   const relatedTaskObjs2 = subRiskIds.map((sid) => ({
        //     relatableId: sid,
        //     relatableType: 'Risk',
        //     taskId: task.id,
        //   }));
        //   await RelatedRisk.bulkCreate(relatedRiskObjs, { transaction: t });
        //   await RelatedTask.bulkCreate(relatedTaskObjs2, { transaction: t });
        // }

        // if (checklistsAttributes && Object.keys(checklistsAttributes).length > 0) {
        //   const checklistObjs = Object.values(checklistsAttributes).map((value) => {
        //     if (value.id) {
        //       const c = allChecklists.find((cc) => cc.id === parseInt(value.id));
        //       if (value._destroy && value._destroy === 'true') {
        //         return c.destroy({ transaction: t });
        //       } else {
        //         c.setAttributes(value);
        //         return c.save({ transaction: t });
        //       }
        //     } else {
        //       delete value._destroy;
        //       const c = Checklist.build({
        //         ...value,
        //         listableId: task.id,
        //         listableType: 'Task',
        //       });
        //       c.progressLists.forEach((p) => {
        //         p.userId = user.id;
        //       });
        //       return c.save({ transaction: t });
        //     }
        //   });
        //   // NOTE: as currently we don't have a solution for nested attributes
        //   // await Checklist.bulkCreate(checklistObjs, { transaction: t });
        // }

        // NOTE: This is not working inside the Transaction block.
        // Reproduce: Create a new task with a file and link both, and it is giving an error
        task.addResourceAttachment(params);

        // await task.updateClosed();

        // await task.reload();
        return task;
      } catch (error) {
        // Handle the error
        console.error("Error in execution", error);
      }
    }

    async addResourceAttachment(params) {
      const { addAttachment } = require("../../utils/helpers");
      addAttachment(params, this);
    }

    async manageChecklists(params) {
      const { db } = require("./index.js");
      if (params.checklists_attributes) {
        var create_checklist = [];
        var delete_checklist_ids = [];
        for (var checklist of params.checklists_attributes) {
          if (checklist["_destroy"] && checklist["_destroy"] == "true" && checklist.id) {
            delete_checklist_ids.push(checklist.id);
          } else {
            checklist["listable_id"] = this.id;
            checklist["listable_type"] = "Task";

            if (!checklist["user_id"] || checklist["user_id"] == "null") {
              checklist["user_id"] = this.user_id;
            }
            create_checklist.push(checklist);
          }
        }
        if (delete_checklist_ids.length > 0) {
          await db.Checklist.destroy({ where: { id: delete_checklist_ids } });
        }

        if (create_checklist.length > 0) {
          await db.Checklist.bulkCreate(create_checklist, { updateOnDuplicate: ["id"] });
        }
      }
    }

    async manageNotes(params) {
      const { db } = require("./index.js");
      if (params.notes_attributes) {
        var create_notes = [];
        var delete_note_ids = [];
        for (var note of params.notes_attributes) {
          note["noteable_id"] = this.id;
          note["noteable_type"] = "Task";
          if (note["_destroy"] && note["_destroy"] == "true" && note.id) {
            delete_note_ids.push(note.id);
          } else {
            create_notes.push(note);
          }
        }
        if (create_notes.length > 0) {
          await db.Note.bulkCreate(create_notes, { updateOnDuplicate: ["id"] });
        }
        if (delete_note_ids.length > 0) {
          await db.Note.destroy({ where: { id: delete_note_ids } });
        }
        // console.log("*****delete_note_ids", delete_note_ids)
      }
    }
    toJSON() {
      let _resource = this.get({ plain: true });
      return _resource;
    }
    async TO_JSON() {
      const { db } = require("./index.js");
      const { validUrl } = require("../../utils/helpers.js");

      let _resource = this.get({ plain: true });
      //Replace this code with eager loading
      // response.checklists = await this.getListable({include: [db.ProgressList]})

      // Add checklists
      _resource.checklists = [];
      console.log("resource---", _resource, this);
      let checklists = await db.Checklist.findAll({ where: { listable_id: this.id, listable_type: "Task" }, raw: true });
      var checklist_ids = _.uniq(
        checklists.map(function (e) {
          return e.id;
        })
      );
      var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids }, raw: true });

      for (var checklist of checklists) {
        checklist.user = { id: checklist.user_id, full_name: "" };
        checklist.progress_lists = progress_lists.filter(function (p) {
          p.checklist_id == checklist.id;
        });
        _resource.checklists.push(checklist);
      }

      if (this.project_contract_id) {
        var projectContract = await this.getProjectContract();
        var contractProjectData = await projectContract.getContractProjectDatum();
        _resource["facility_id"] = null;
        _resource["facility_name"] = null;
        _resource["contract_nickname"] = contractProjectData.name;
        _resource["vehicle_nickname"] = null;
        _resource["project_id"] = projectContract.project_id;
      } else if (this.project_contract_vehicle_id) {
        var projectContractVehicle = await this.getProjectContractVehicle();
        var contractVehicle = await projectContractVehicle.getContractVehicle();

        _resource["facility_id"] = null;
        _resource["facility_name"] = null;
        _resource["contract_nickname"] = null;
        _resource["vehicle_nickname"] = contractVehicle.name;
        _resource["project_id"] = projectContractVehicle.project_id;
      } else {
        let facility_project = await db.FacilityProject.findOne({ where: { id: this.facility_project_id } });
        console.log("task--- facility:", facility_project);
        let facility = await db.Facility.findOne({ where: { id: facility_project.facility_id } });

        _resource["facility_id"] = facility.id;
        _resource["facility_name"] = facility.facility_name;
        _resource["contract_nickname"] = null;
        _resource["vehicle_nickname"] = null;
        _resource["project_id"] = facility_project.project_id;
        // _resource["project_id"] = 1;
      }

      let task_users = await this.getTaskUsers();
      let notes = await db.Note.findAll({ where: { noteable_type: "Task", noteable_id: this.id }, order: [["created_at", "DESC"]], raw: true });
      let all_user_ids = _.compact(
        _.uniq(
          _.map(task_users, function (n) {
            return n.user_id;
          })
        )
      );
      var note_user_ids = _.compact(
        _.uniq(
          _.map(notes, function (n) {
            return n.user_id;
          })
        )
      );
      all_user_ids = _.concat(all_user_ids, note_user_ids);
      let users = await db.User.findAll({ where: { id: all_user_ids } });

      const accountableUserIds = task_users.filter((ru) => ru.accountable()).map((ru) => ru.user_id);
      const responsibleUserIds = task_users.filter((ru) => ru.responsible()).map((ru) => ru.user_id);
      const consultedUserIds = task_users.filter((ru) => ru.consulted()).map((ru) => ru.user_id);
      const informedUserIds = task_users.filter((ru) => ru.informed()).map((ru) => ru.user_id);

      _resource["users"] = [];
      _resource["user_ids"] = [];
      _resource["user_names"] = [];
      for (var user of users) {
        let _uh = {
          id: user.id,
          full_name: user.getFullName(),
          title: user.title,
          phone_number: user.phone_number,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        };
        _resource["users"].push(_uh);
        _resource["user_ids"].push(_uh.id);
        _resource["user_names"].push(_uh.full_name);
      }

      _resource["sub_tasks"] = await db.RelatedTask.findAll({ where: { relatable_type: "Task", relatable_id: this.id }, raw: true });
      _resource["sub_issues"] = await db.RelatedIssue.findAll({ where: { relatable_type: "Task", relatable_id: this.id }, raw: true });
      _resource["sub_risks"] = await db.RelatedRisk.findAll({ where: { relatable_type: "Task", relatable_id: this.id }, raw: true });
      _resource["sub_task_ids"] = _.map(_resource["sub_tasks"], function (u) {
        u.id;
      });
      _resource["sub_issue_ids"] = _.map(_resource["sub_issues"], function (u) {
        u.id;
      });
      _resource["sub_risk_ids"] = _.map(_resource["sub_risks"], function (u) {
        u.id;
      });
      _resource["responsible_users"] = _.filter(users, function (u) {
        return responsibleUserIds.includes(u.id);
      });
      _resource["responsible_users_last_name"] = _.map(_resource["responsible_users"], function (u) {
        return u.last_name;
      });
      _resource["responsible_users_first_name"] = _.map(_resource["responsible_users"], function (u) {
        return u.first_name;
      });
      _resource["accountable_users"] = _.filter(users, function (u) {
        return accountableUserIds.includes(u.id);
      });
      _resource["accountable_users_last_name"] = _.map(_resource["accountable_users"], function (u) {
        return u.last_name;
      });
      _resource["accountable_users_first_name"] = _.map(_resource["accountable_users"], function (u) {
        return u.first_name;
      });
      _resource["consulted_users"] = _.filter(users, function (u) {
        return consultedUserIds.includes(u.id);
      });
      _resource["informed_users"] = _.filter(users, function (u) {
        return informedUserIds.includes(u.id);
      });
      _resource["responsible_user_ids"] = responsibleUserIds;
      _resource["accountable_user_ids"] = accountableUserIds;
      _resource["consulted_user_ids"] = consultedUserIds;
      _resource["informed_user_ids"] = informedUserIds;
      _resource["progress_status"] = _resource.progress >= 100 ? "completed" : "active";
      _resource["task_type_id"] = parseInt(_resource["task_type_id"]);
      _resource["task_stage_id"] = parseInt(_resource["task_stage_id"]);
      _resource["due_date_duplicate"] = [];
      _resource["attach_files"] = [];

      let blobs = await db.ActiveStorageBlob.findAll({ where: { record_type: "Task", record_id: this.id } });
      blobs = blobs.filter(
        (file, index, self) => index === self.findIndex((t) => t.id === file.id && t.name === file.name && t.uri === file.uri) // Remove duplicates
      );
      for (var blob of blobs) {
        // console.log("******blob", file)
        if (blob.filename) {
          // Check if filename exists
          try {
            if (blob.content_type === "text/plain" && validUrl(blob.filename)) {
              // If content type is text/plain and filename is a valid URL
              _resource["attach_files"].push({
                id: blob.id,
                key: blob.key,
                name: blob.filename,
                uri: blob.filename,
                link: true,
              });
            } else {
              // If content type is not text/plain or filename is not a valid URL
              _resource["attach_files"].push({
                id: blob.id,
                key: blob.key,
                name: blob.filename,
                uri: `/download/${blob.id}`, // Assuming files are served from /files route
                link: false,
              });
            }
          } catch (error) {
            console.error("There is an exception:", error);
          }
        }
      }

      _resource["notes"] = [];
      for (var note of notes) {
        let n = note;
        let user = _.find(users, function (u) {
          return u.id == n.user_id;
        });
        n["user"] = { id: user.id, full_name: user.full_name };

        _resource["notes"].push(n);
      }
      _resource["last_update"] = _resource["notes"][0];

      _resource["class_name"] = "Task";

      return _resource;
    }

    async assignUsers(params) {
      const { db } = require("./index.js");

      const accountableResourceUsers = [];
      const responsibleResourceUsers = [];
      const consultedResourceUsers = [];
      const informedResourceUsers = [];
      const p_accountable_user_ids = _.compact(params.accountable_user_ids);
      const p_responsible_user_ids = _.compact(params.responsible_user_ids);
      const p_consulted_user_ids = _.compact(params.consulted_user_ids);
      const p_informed_user_ids = _.compact(params.informed_user_ids);

      const resource = this;
      const resourceUsers = await resource.getTaskUsers();
      const accountableUserIds = resourceUsers.filter((ru) => ru.accountable()).map((ru) => ru.user_id);
      const responsibleUserIds = resourceUsers.filter((ru) => ru.responsible()).map((ru) => ru.user_id);
      const consultedUserIds = resourceUsers.filter((ru) => ru.consulted()).map((ru) => ru.user_id);
      const informedUserIds = resourceUsers.filter((ru) => ru.informed()).map((ru) => ru.user_id);

      const usersToDelete = [];

      if (p_accountable_user_ids && p_accountable_user_ids.length > 0) {
        p_accountable_user_ids.forEach((uid) => {
          console.log("Testing Include");
          if (uid !== "undefined" && !accountableUserIds.includes(parseInt(uid))) {
            console.log("Testing Include If");
            accountableResourceUsers.push({
              user_id: parseInt(uid),
              task_id: resource.id,
              user_type: "accountable",
            });
          }
        });
        usersToDelete.push(...accountableUserIds.filter((uid) => !p_accountable_user_ids.includes(uid.toString())));
      }

      if (p_responsible_user_ids && p_responsible_user_ids.length > 0) {
        p_responsible_user_ids.forEach((uid) => {
          if (uid !== "undefined" && !responsibleUserIds.includes(parseInt(uid))) {
            responsibleResourceUsers.push({
              user_id: parseInt(uid),
              task_id: resource.id,
              user_type: "responsible",
            });
          }
        });
        usersToDelete.push(...responsibleUserIds.filter((uid) => !p_responsible_user_ids.includes(uid.toString())));
      }

      if (p_consulted_user_ids && p_consulted_user_ids.length > 0) {
        p_consulted_user_ids.forEach((uid) => {
          if (uid !== "undefined" && !consultedUserIds.includes(parseInt(uid))) {
            consultedResourceUsers.push({
              user_id: parseInt(uid),
              task_id: resource.id,
              user_type: "consulted",
            });
          }
        });
        usersToDelete.push(...consultedUserIds.filter((uid) => !p_consulted_user_ids.includes(uid.toString())));
      }

      if (p_informed_user_ids && p_informed_user_ids.length > 0) {
        p_informed_user_ids.forEach((uid) => {
          if (uid !== "undefined" && !informedUserIds.includes(parseInt(uid))) {
            informedResourceUsers.push({
              user_id: parseInt(uid),
              task_id: resource.id,
              user_type: "informed",
            });
          }
        });
        usersToDelete.push(...informedUserIds.filter((uid) => !p_informed_user_ids.includes(uid.toString())));
      }

      const recordsToImport = [...accountableResourceUsers, ...responsibleResourceUsers, ...consultedResourceUsers, ...informedResourceUsers];
      if (usersToDelete.length > 0) {
        resourceUsers.filter((ru) => usersToDelete.includes(ru.user_id)).forEach((ru) => ru.destroy());
      }

      if (recordsToImport.length > 0) {
        // TaskUser.import(recordsToImport);

        const taskUsers = await db.TaskUser.bulkCreate(recordsToImport);
      }
    }
  }
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Ensure id is marked as primary key
        autoIncrement: true,
      },
      text: DataTypes.STRING,
      description: DataTypes.TEXT,
      due_date: DataTypes.DATE,
      progress: DataTypes.INTEGER,
      task_type_id: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      facility_project_id: DataTypes.INTEGER,
      auto_calculate: DataTypes.BOOLEAN,
      watched: DataTypes.BOOLEAN,
      watched_at: DataTypes.DATE,
      task_stage_id: DataTypes.INTEGER,
      kanban_order: DataTypes.INTEGER,
      important: DataTypes.BOOLEAN,
      ongoing: DataTypes.BOOLEAN,
      draft: DataTypes.BOOLEAN,
      on_hold: DataTypes.BOOLEAN,
      reportable: DataTypes.BOOLEAN,
      closed_date: DataTypes.DATE,
      contract_id: DataTypes.INTEGER,
      project_contract_id: DataTypes.INTEGER,
      project_contract_vehicle_id: DataTypes.INTEGER,
      owner_id: DataTypes.INTEGER,
      owner_type: DataTypes.STRING,
      planned_effort: DataTypes.DECIMAL(10, 2),
      actual_effort: DataTypes.DECIMAL(10, 2),
      auto_calculate_planned_effort: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "tasks",
      modelName: "Task",
      underscored: true,
    }
  );
  return Task;
};
