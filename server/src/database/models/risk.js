"use strict";
const { _ } = require("lodash");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Risk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.User);
      this.hasMany(models.RiskUser, { onDelete: "CASCADE", hooks: true });
      // this.belongsTo(models.RiskStage);
      // this.belongsToMany(models.User,{through: models.RiskUser, foreignKey: '', otherKey: '' });
      this.belongsTo(models.TaskType, { foreignKey: "task_type_id" });
      // // this.hasMany(models.RiskFile);
      this.hasMany(models.Note, {
        foreignKey: "noteable_id",
        constraints: false,
        scope: {
          noteable_type: "Risk",
        },
      });
      this.belongsTo(models.FacilityProject, { foreignKey: "facility_project_id", onDelete: "CASCADE", as: "RiskFacilityProject" });
      this.belongsToMany(models.Project, { through: models.FacilityProject, foreignKey: "project_id" });
      // this.belongsTo(models.Contract);
      this.belongsTo(models.ProjectContract, { foreignKey: "project_contract_id" });
      this.belongsTo(models.ProjectContractVehicle, { foreignKey: "project_contract_vehicle_id" });
      this.hasMany(models.Checklist, {
        as: "listable",
        foreignKey: "listable_id",
        constraints: false,
        scope: {
          listable_type: "Risk",
        },
      });
      this.hasMany(models.RelatedTask, {
        foreignKey: "relatable_id",
        constraints: false,
        scope: {
          relatable_type: "Risk",
        },
      });
      this.hasMany(models.RelatedRisk, {
        foreignKey: "relatable_id",
        constraints: false,
        scope: {
          relatable_type: "Risk",
        },
      });
      this.hasMany(models.RelatedIssue, {
        foreignKey: "relatable_id",
        constraints: false,
        scope: {
          relatable_type: "Risk",
        },
      });
      // // this.belongsToMany(models.SubTask,{through: models.RelatedTask, foreignKey: '', otherKey: '' });
      // // this.belongsToMany(models.SubRisk,{through: models.RelatedRisk, foreignKey: '', otherKey: '' });
      // // this.belongsToMany(models.SubRisk,{through: models.RelatedRisk, foreignKey: '', otherKey: '' })
    }
    async createOrUpdateRisk(params, options) {
      try {
        console.log("options----", options, params);
        const { db } = require("./index.js");
        let user = options.user;
        let project_id = options.project_id;
        let facility_id = options.facility_id;
        const riskParams = params;
        const iParams = { ...riskParams };
        console.log("iParams", iParams);
        const user_ids = iParams.user_ids;
        // const subTaskIds = iParams.subTaskIds;
        // const subRiskIds = iParams.subRiskIds;
        // const subRiskIds = iParams.subRiskIds;
        const checklistsAttributes = iParams.checklistsAttributes;
        // const notesAttributes = iParams.notesAttributes;

        if (!iParams.planned_effort) {
          iParams.planned_effort = 0.0;
        }
        if (!iParams.actual_effort) {
          iParams.actual_effort = 0.0;
        }
        let facility_project = await db.FacilityProject.findOne({
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
          ],
          where: { project_id: project_id, facility_id: facility_id },
          raw: true,
        });
        iParams["facility_project_id"] = facility_project.id;
        iParams["risk_approach"] = this.getRiskApproachValue(iParams["risk_approach"]);
        console.log("**********iParams", iParams);

        this.setAttributes(iParams);

        console.log("***risk.planned_effort", this.planned_effort);

        if (iParams.project_contract_id) {
          this.project_contract_id = params.project_contract_id;
        } else if (iParams.project_contract_vehicle_id) {
          this.project_contract_vehicle_id = params.project_contract_vehicle_id;
        }

        const allChecklists = await db.Checklist.findAll({ where: { listable_id: this.id, listable_type: "Risk" } });

        await this.save();

        await this.assignUsers(params);
        await this.manageNotes(iParams);
        await this.manageChecklists(iParams);
        // if (subTaskIds && subTaskIds.length > 0) {
        //   const relatedTaskObjs = subTaskIds.map((sid) => ({
        //     relatableId: risk.id,
        //     relatableType: 'Risk',
        //     riskId: sid,
        //   }));
        //   const relatedTaskObjs2 = subTaskIds.map((sid) => ({
        //     relatableId: sid,
        //     relatableType: 'Risk',
        //     riskId: risk.id,
        //   }));
        //   await RelatedTask.bulkCreate(relatedTaskObjs, { transaction: t });
        //   await RelatedTask.bulkCreate(relatedTaskObjs2, { transaction: t });
        // }

        // if (subRiskIds && subRiskIds.length > 0) {
        //   const relatedRiskObjs = subRiskIds.map((sid) => ({
        //     relatableId: risk.id,
        //     relatableType: 'Risk',
        //     riskId: sid,
        //   }));
        //   const relatedTaskObjs2 = subRiskIds.map((sid) => ({
        //     relatableId: sid,
        //     relatableType: 'Risk',
        //     riskId: risk.id,
        //   }));
        //   await RelatedRisk.bulkCreate(relatedRiskObjs, { transaction: t });
        //   await RelatedTask.bulkCreate(relatedTaskObjs2, { transaction: t });
        // }

        // if (subRiskIds && subRiskIds.length > 0) {
        //   const relatedRiskObjs = subRiskIds.map((sid) => ({
        //     relatableId: risk.id,
        //     relatableType: 'Risk',
        //     riskId: sid,
        //   }));
        //   const relatedTaskObjs2 = subRiskIds.map((sid) => ({
        //     relatableId: sid,
        //     relatableType: 'Risk',
        //     riskId: risk.id,
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
        //         listableId: risk.id,
        //         listableType: 'Risk',
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
        // Reproduce: Create a new risk with a file and link both, and it is giving an error
        //risk.addResourceAttachment(params);

        // await risk.updateClosed();

        // await risk.reload();
        return this;
      } catch (error) {
        // Handle the error
        console.error("Error in execution", error);
      }
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
            checklist["listable_type"] = "Risk";

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
          note["noteable_type"] = "Risk";
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
        console.log("*****delete_note_ids", delete_note_ids);
      }
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
      const resourceUsers = await resource.getRiskUsers();
      const accountableUserIds = resourceUsers.filter((ru) => ru.accountable()).map((ru) => ru.user_id);
      const responsibleUserIds = resourceUsers.filter((ru) => ru.responsible()).map((ru) => ru.user_id);
      const consultedUserIds = resourceUsers.filter((ru) => ru.consulted()).map((ru) => ru.user_id);
      const informedUserIds = resourceUsers.filter((ru) => ru.informed()).map((ru) => ru.user_id);

      const usersToDelete = [];

      if (p_accountable_user_ids && p_accountable_user_ids.length > 0) {
        p_accountable_user_ids.forEach((uid) => {
          if (uid !== "undefined" && !accountableUserIds.includes(parseInt(uid))) {
            accountableResourceUsers.push({
              user_id: parseInt(uid),
              risk_id: resource.id,
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
              risk_id: resource.id,
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
              risk_id: resource.id,
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
              risk_id: resource.id,
              user_type: "informed",
            });
          }
        });
        usersToDelete.push(...informedUserIds.filter((uid) => !p_informed_user_ids.includes(uid.toString())));
      }

      const recordsToImport = [...accountableResourceUsers, ...responsibleResourceUsers, ...consultedResourceUsers, ...informedResourceUsers];
      console.log("***recordsToImport", recordsToImport);
      console.log("***recordsToImport", usersToDelete);
      if (usersToDelete.length > 0) {
        resourceUsers.filter((ru) => usersToDelete.includes(ru.user_id)).forEach((ru) => ru.destroy());
      }

      if (recordsToImport.length > 0) {
        // TaskUser.import(recordsToImport);

        const riskUsers = await db.RiskUser.bulkCreate(recordsToImport);
      }
    }
    toJSON() {
      let _resource = this.get({ plain: true });
      return _resource;
    }
    async TO_JSON() {
      const { db } = require("./index.js");

      let _resource = this.get({ plain: true });
      _resource["risk_approach"] = this.getRiskApproach(_resource["risk_approach"]);
      _resource["priority_level_name"] = this.getPriorityLevelName(_resource["priority_level"]);
      _resource["probability_name"] = this.getProbabilityName(_resource["probability"]);
      _resource["impact_level_name"] = this.getImpactLevelName(_resource["impact_level"]);
      _resource["impact_level"] = parseInt(_resource["impact_level"]);
      _resource["priority_level"] = parseInt(_resource["priority_level"]);
      _resource["probability"] = parseInt(_resource["probability"]);
      _resource["status"] = parseInt(_resource["status"]);
      _resource["duration"] = parseInt(_resource["duration"]);
      //Replace this code with eager loading
      // response.checklists = await this.getListable({include: [db.ProgressList]})

      // Add checklists
      _resource.checklists = [];
      let checklists = await db.Checklist.findAll({ where: { listable_id: _resource.id, listable_type: "Risk" }, raw: true });
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

      let facility_project = await db.FacilityProject.findOne({
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
        ],
        where: { id: _resource["facility_project_id"] },
        raw: true,
      });
      console.log("Json--", facility_project);
      let facility = await db.Facility.findOne({ where: { id: facility_project.facility_id } });
      let risk_users = await this.getRiskUsers();
      let notes = await db.Note.findAll({ where: { noteable_type: "Risk", noteable_id: this.id }, order: [["created_at", "DESC"]], raw: true });
      let all_user_ids = _.compact(
        _.uniq(
          _.map(risk_users, function (n) {
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

      const accountableUserIds = risk_users.filter((ru) => ru.accountable()).map((ru) => ru.user_id);
      const responsibleUserIds = risk_users.filter((ru) => ru.responsible()).map((ru) => ru.user_id);
      const consultedUserIds = risk_users.filter((ru) => ru.consulted()).map((ru) => ru.user_id);
      const informedUserIds = risk_users.filter((ru) => ru.informed()).map((ru) => ru.user_id);

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

      _resource["sub_tasks"] = await db.RelatedTask.findAll({ where: { relatable_type: "Task", relatable_id: _resource.id }, raw: true });
      _resource["sub_risks"] = await db.RelatedRisk.findAll({ where: { relatable_type: "Task", relatable_id: _resource.id }, raw: true });
      _resource["sub_risks"] = await db.RelatedRisk.findAll({ where: { relatable_type: "Task", relatable_id: _resource.id }, raw: true });
      _resource["sub_task_ids"] = _.map(_resource["sub_tasks"], function (u) {
        return u.id;
      });
      _resource["sub_risk_ids"] = _.map(_resource["sub_risks"], function (u) {
        return u.id;
      });
      _resource["sub_risk_ids"] = _.map(_resource["sub_risks"], function (u) {
        return u.id;
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
      _resource["facility_id"] = facility.id;
      _resource["facility_name"] = facility.facility_name;
      _resource["contract_nickname"] = null;
      _resource["vehicle_nickname"] = null;
      _resource["project_id"] = facility_project.project_id;
      _resource["progress_status"] = _resource.progress >= 100 ? "completed" : "active";
      _resource["task_type_id"] = parseInt(_resource["task_type_id"]);
      _resource["risk_stage_id"] = parseInt(_resource["risk_stage_id"]);
      _resource["due_date_duplicate"] = [];
      _resource["attach_files"] = [];

      let blobs = await db.ActiveStorageBlob.findAll({ where: { record_type: "Risk", record_id: this.id } });
      blobs = blobs.filter(
        (file, index, self) => index === self.findIndex((t) => t.id === file.id && t.name === file.name && t.uri === file.uri) // Remove duplicates
      );
      for (var blob of blobs) {
        // console.log("******blob", file)
        if (blob.filename) {
          // Check if filename exists
          try {
            if (blob.content_type === "text/plain" && this.validUrl(blob.filename)) {
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

      _resource["class_name"] = "Risk";

      return _resource;
    }
    async addResourceAttachment(params) {
      const { addAttachment } = require("../../utils/helpers");
      addAttachment(params, this);
      console.log("Attachment:--P", params);
      const { db } = require("./index.js");

      var linkFiles = params.file_links;
      const attachmentFiles = params.risk.risk_files || [];

      if (linkFiles && linkFiles.length > 0) {
        for (var f of linkFiles) {
          if (f && validUrl.isUri(f)) {
            let filename = f;
            if (f.length > 252) {
              filename = f.substring(0, 252) + "...";
            }
            // `key`, `filename`, `content_type`, `metadata`, `byte_size`, `checksum`, `created_at`, `service_name`
            var blob = await db.ActiveStorageBlob.create({
              // Assuming taskFiles is a Sequelize attachment association
              key: db.ActiveStorageBlob.generateRandomAlphaNumericString(),
              name: "risk_files",
              record_type: "Risk",
              record_id: this.id,
              filename: filename,
              content_type: "text/plain",
              service_name: "local",
              metadata: "",
              byte_size: filename.length,
              checksum: "",
            });
          }
        }
      }

      if (attachmentFiles && attachmentFiles.length > 0) {
        // Using Stream in nodejs
        const fs = require("fs");
        const path = require("path");

        console.log("**** taskFiles", attachmentFiles);
        const rootDir = path.resolve(__dirname, "..", "..", "..", "uploads");

        console.log("******Current directory:", rootDir);

        for await (const file of attachmentFiles) {
          const passThroughStream = file.stream;

          // upload and save the file
          // var writerStream = fs.createWriteStream(`./uploads/${part.originalName}`);
          var file_key = db.ActiveStorageBlob.generateRandomAlphaNumericString();

          var blob = await db.ActiveStorageBlob.build({
            name: "risk_files",
            key: file_key,
            record_id: this.id,
            record_type: "Risk",
            filename: file.originalName,
            content_type: file.mimeType,
            service_name: "local",
            metadata: "",
            byte_size: file_key.length,
            checksum: "",
          });

          var dir = `${rootDir}/${blob.getFolderPath()}`;

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const writeStream = fs.createWriteStream(`${dir}/${file.originalName}`);

          writeStream.on("error", (err) => {
            console.log("*******Error writing file:", err);
          });
          writeStream.on("finish", async () => {
            console.log("********File saved successfully", this, file);
            await blob.save();
          });
          passThroughStream.on("end", () => {
            console.log("********PassThrough stream ended");
          });
          passThroughStream.on("error", (err) => {
            console.log("********PassThrough stream error:", err);
          });
          await passThroughStream.pipe(writeStream);
          passThroughStream.end();
        }
      }
    }
    getPriorityLevelName(priority_level) {
      var n = "Very Low";
      if ([1].includes(priority_level)) {
        n = "Very Low";
      } else if ([2, 3].includes(priority_level)) {
        n = "Low";
      } else if ([4, 5, 6].includes(priority_level)) {
        n = "Moderate";
      } else if ([8, 9, 10, 12].includes(priority_level)) {
        n = "High";
      } else if ([15, 16, 20, 25].includes(priority_level)) {
        n = "Extreme";
      }
      return n;
    }

    getImpactLevelNameHash() {
      return {
        1: "1 - Negligible",
        2: "2 - Minor",
        3: "3 - Moderate",
        4: "4 - Major",
        5: "5 - Catastrophic",
      };
    }

    getImpactLevelName(level_number) {
      if (this.getImpactLevelNameHash()[level_number]) {
        return this.getImpactLevelNameHash()[level_number];
      } else {
        return this.getImpactLevelNameHash()[1];
      }
    }

    getProbabilityNameHash() {
      return {
        1: "1 - Rare",
        2: "2 - Unlikely",
        3: "3 - Possible",
        4: "4 - Likely",
        5: "5 - Almost Certain",
      };
    }

    getProbabilityName(probability_number) {
      if (this.getProbabilityNameHash()[probability_number]) {
        return this.getProbabilityNameHash()[probability_number];
      } else {
        return this.getProbabilityNameHash()[1];
      }
    }

    getRiskApproach(v) {
      return {
        0: "avoid",
        1: "mitigate",
        2: "transfer",
        3: "accept",
      }[v];
    }
    getRiskApproachValue(v) {
      console.log("Hi hello: ", v);
      return {
        avoid: 0,
        mitigate: 1,
        transfer: 2,
        accept: 3,
      }[v];
    }
    getDurationNameHash() {
      return {
        1: "Temporary",
        2: "Perpetual",
      };
    }
    getDurationName(duration_number) {
      if (this.getDurationNameHash()[duration_number]) {
        return this.getDurationNameHash()[duration_number];
      } else {
        return this.getDurationNameHash()[1];
      }
    }
  }
  Risk.init(
    {
      risk_description: DataTypes.TEXT,
      impact_description: DataTypes.TEXT,
      start_date: DataTypes.DATE,
      due_date: DataTypes.DATE,
      auto_calculate: DataTypes.BOOLEAN,
      progress: DataTypes.INTEGER,
      probability: DataTypes.INTEGER,
      impact_level: DataTypes.INTEGER,
      priority_level: DataTypes.INTEGER,
      risk_approach: DataTypes.INTEGER,
      risk_approach_description: DataTypes.TEXT,
      watched: DataTypes.BOOLEAN,
      watched_at: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
      facility_project_id: DataTypes.INTEGER,
      task_type_id: DataTypes.INTEGER,
      text: DataTypes.STRING,
      kanban_order: DataTypes.INTEGER,
      risk_stage_id: DataTypes.INTEGER,
      probability_name: DataTypes.STRING,
      impact_level_name: DataTypes.STRING,
      probability_description: DataTypes.TEXT,
      approval_time: DataTypes.STRING,
      approved: DataTypes.BOOLEAN,
      important: DataTypes.BOOLEAN,
      ongoing: DataTypes.BOOLEAN,
      draft: DataTypes.BOOLEAN,
      on_hold: DataTypes.BOOLEAN,
      explanation: DataTypes.TEXT,
      duration: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      duration_name: DataTypes.STRING,
      status_name: DataTypes.STRING,
      reportable: DataTypes.BOOLEAN,
      closed_date: DataTypes.DATE,
      contract_id: DataTypes.INTEGER,
      project_contract_id: DataTypes.INTEGER,
      project_contract_vehicle_id: DataTypes.INTEGER,
      owner_id: DataTypes.INTEGER,
      owner_type: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "risks",
      modelName: "Risk",
      underscored: true,
    }
  );
  return Risk;
};
