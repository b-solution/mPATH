"use strict";

const { _ } = require("lodash");
const { compactAndUniq } = require("../../utils/helpers");

const { Op, Model, QueryTypes } = require("sequelize");
const facility = require("./facility");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.hasMany(models.ProjectUser);
      this.belongsToMany(models.User, { through: models.ProjectUser, foreignKey: "project_id", otherKey: "user_id" });
      this.hasMany(models.FacilityProject, { foreignKey: "project_id" });

      this.belongsToMany(models.Facility, { through: models.FacilityProject, foreignKey: "facility_id" });

      this.hasMany(models.ProjectFacilityGroup);
      this.belongsToMany(models.FacilityGroup, { through: models.ProjectFacilityGroup, foreignKey: "project_id" });

      // // this.belongsToMany(models.ProjectGroup,{through: models.ProjectFacilityGroup, foreignKey: 'project_id' })
      this.belongsToMany(models.Issue, { through: models.FacilityProject, foreignKey: "project_id", otherKey: "issue_id" });
      this.belongsToMany(models.Risk, { through: models.FacilityProject, foreignKey: "project_id" });
      this.belongsToMany(models.Lesson, { through: models.FacilityProject, foreignKey: "project_id", otherKey: "lesson_id" });

      // this.belongsTo(models.ProjectType)

      this.hasMany(models.ProjectStatus);
      this.belongsToMany(models.Status, { through: models.ProjectStatus, foreignKey: "status_id" });
      this.hasMany(models.ProjectTaskType);
      this.belongsToMany(models.TaskType, { through: models.ProjectTaskType, foreignKey: "project_id" });
      // this.hasMany(models.ProjectIssueType)
      // this.belongsToMany(models.IssueType,{ through: models.ProjectIssueType, foreignKey: 'project_id' })

      // this.hasMany(models.ProjectIssueSeverity)
      // this.belongsToMany(models.IssueSeverity,{through: models.ProjectIssueSeverity, foreignKey: 'project_id' })

      this.hasMany(models.ProjectTaskStage);
      this.belongsToMany(models.TaskStage, { through: models.ProjectTaskStage, foreignKey: "project_id" });
      // this.hasMany(models.ProjectRiskStage)
      // this.belongsToMany(models.RiskStage,{through: models.ProjectRiskStage, foreignKey: 'project_id' })

      // this.hasMany(models.ProjectIssueStage)
      // this.belongsToMany(models.IssueStage,{through: models.ProjectIssueStage, foreignKey: 'project_id' })
      this.hasMany(models.FavoriteFilter);
      this.hasMany(models.QueryFilter);

      // this.hasMany(models.ProjectLessonStage)
      // this.belongsToMany(models.LessonStage,{through: models.ProjectLessonStage, foreignKey: 'project_id' })
      // this.hasMany(models.Contract)
      // this.hasMany(models.Role)
      this.hasMany(models.ProjectFacilityGroup);
      this.hasMany(models.RoleUser);
      this.hasMany(models.ProjectContract);
      this.belongsToMany(models.ContractProjectDatum, {
        through: models.ProjectContract,
        foreignKey: "project_id",
        other_key: "contract_project_datum_id",
      });
      this.hasMany(models.ProjectContractVehicle);
      //this.belongsToMany(models.ContractVehicle, { through: models.ProjectContractVehicle, foreignKey: "project_id", otherKey:'contract_vehicle_id' });
      // // this.hasMany(models.ProjectContractVehicleGroup)
    }
    toJSON() {
      let h = { ...super.toJSON() };
      h["status"] = this.getStatus(h["status"]);
      return h;
    }
    getStatus(v) {
      return {
        0: "inactive",
        1: "active",
      }[v];
    }

    async getDefaultFacilityGroup() {
      try {
        return await this.createDefaultFacilityGroup();
      } catch (error) {
        throw new Error(`Error getting default facility group: ${error}`);
      }
    }

    async listDefaultFacilityGroupIds() {
      try {
        const projectFacilityGroups = await this.getProjectFacilityGroups({ where: { is_default: true } });

        return compactAndUniq(
          _.map(projectFacilityGroups, function (pfg) {
            return pfg.facility_group_id;
          })
        );
      } catch (error) {
        throw new Error(`Error listing default facility group ids: ${error}`);
      }
    }

    async createDefaultFacilityGroup() {
      try {
        const { db } = require("./index.js");
        var project = this;
        let projectFacilityGroups = await project.getProjectFacilityGroups();
        let facilityGroupIds = compactAndUniq(
          _.map(projectFacilityGroups, function (pfg) {
            return pfg.facility_group_id;
          })
        );
        var facilityGroups = await db.FacilityGroup.findAll({ where: { id: facilityGroupIds, is_default: true } });

        if (facilityGroups.length < 1) {
          var group = await db.FacilityGroup.create({
            name: "Unassigned",
            owner_id: project.id,
            owner_type: "Project",
            is_default: true,
          });
          await db.ProjectFacilityGroup.create({ facility_group_id: group.id, project_id: project.id });
          return group;
        } else {
          return await facilityGroups[0];
        }
      } catch (error) {
        throw new Error(`Error creating default facility group: ${error}`);
      }
    }

    async getProgramAdmins(options = {}) {
      const { db } = require("./index.js");

      if (!options["role_id"]) {
        var _r = await db.Role.programAdminUserRole();
        options["role_id"] = Number(_r.id);
      }
      var roleUsers = await this.getRoleUsers();
      var user_ids = _.uniq(
        _.compact(
          _.map(roleUsers, function (ru) {
            if (ru.role_id == options["role_id"]) {
              return ru.user_id;
            }
          })
        )
      );
      var projectUsers = await this.getProjectUsers();
      var puser_ids = _.uniq(
        _.map(projectUsers, function (ru) {
          return Number(ru.user_id);
        })
      );
      var admin_user_ids = _.compact(
        _.map(puser_ids, function (uid) {
          if (user_ids.includes(uid)) {
            return uid;
          }
        })
      );
      var admin_users = await db.User.findAll({ where: { id: admin_user_ids } });
      return admin_users;
    }
    async getProgramAdminIds() {
      let padmins = await this.getProgramAdmins();
      return _.map(padmins, function (p) {
        return p.id;
      });
    }
    async build_json_response(options) {
      const { db } = require("./index.js");
      const { getCurrentUser, printParams, compactAndUniq } = require("../../utils/helpers.js");

      let response = this.toJSON();
      let all_tasks = [];
      let all_issues = [];
      let all_risks = [];
      let all_notes = [];

      let user = options.user;
      // let role_users = await db.RoleUser.findAll({where: {user_id: user.id}})
      // let role_ids = _.uniq(_.map(role_users, function(f){ return f.role_id } ))
      // let role_privileges = await db.RolePrivilege.findAll({
      //   where: {
      //     role_id: role_ids,
      //     privilege: {
      //       [Op.regexp]: "^[RWD]"
      //     }
      //   },
      // });
      // let role_privilege_role_ids = _.uniq(_.map(role_privileges, function(f){ return f.role_id } ))
      // let role_users2 = await db.RoleUser.findAll({where: {user_id: user.id, role_id: role_privilege_role_ids}})
      // let authorized_facility_project_ids = _.uniq(_.map(role_users2, function(f){ return f.facility_project_id } ))
      // let authorized_project_contract_ids = _.uniq(_.map(role_users2, function(f){ return f.project_contract_id } ))
      // let authorized_project_contract_vehicle_ids = _.uniq(_.map(role_users2, function(f){ return f.project_contract_vehicle_id } ))
      let authorized_data = [];
      let authorized_facility_project_ids = [];
      let authorized_project_contract_ids = [];
      let authorized_project_contract_vehicle_ids = [];
      options["response_for"] = options["response_for"] ? options["response_for"] : "client_panel";
      if (options["response_for"] == "program_settings") {
        var authorized_facility_projects = await db.FacilityProject.findAll({
          where: { project_id: this.id },
          raw: true,
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
            "Status_id",
            "IssueId",
          ],
        });
        authorized_facility_project_ids = [];
        for (var fp of authorized_facility_projects) {
          authorized_facility_project_ids.push(fp.id);
        }
        var authorized_project_contracts = await db.ProjectContract.findAll({ where: { project_id: this.id } });
        authorized_project_contract_ids = compactAndUniq(
          _.map(authorized_project_contracts, function (pc) {
            return pc.id;
          })
        );
        var authorized_project_contract_vehicles = await db.ProjectContractVehicle.findAll({ where: { project_id: this.id } });
        authorized_project_contract_vehicle_ids = compactAndUniq(
          _.map(authorized_project_contract_vehicles, function (pcv) {
            return pcv.id;
          })
        );
      } else if (options["response_for"] == "client_panel") {
        authorized_data = await user.getAuthorizedData();
        authorized_facility_project_ids = authorized_data.authorized_facility_project_ids;
        authorized_project_contract_ids = authorized_data.authorized_project_contract_ids;
        authorized_project_contract_vehicle_ids = authorized_data.authorized_project_contract_vehicle_ids;
      }
      response["1authorized_project_contract_vehicle_ids"] = authorized_project_contract_vehicle_ids;
      let sql_result = "";

      let facility_project_ids_with_project_tasks = [];
      let facility_project_ids_with_project_issues = [];
      let facility_project_ids_with_project_risks = [];
      let facility_project_ids_with_project_lessons = [];
      let facility_project_ids_with_project_notes = [];

      if (authorized_facility_project_ids.length > 0) {
        sql_result = await sequelize.query(
          "SELECT distinct(facility_project_id), role_type FROM `role_users` INNER JOIN `roles` ON `roles`.`id` = `role_users`.`role_id` INNER JOIN `role_privileges` ON `role_privileges`.`role_id` = `roles`.`id` WHERE `role_users`.`user_id` = 1 AND (role_privileges.privilege REGEXP '^[RWD]' and role_users.facility_project_id in (:facility_project_ids))",
          {
            replacements: { facility_project_ids: authorized_facility_project_ids },
            type: QueryTypes.SELECT,
          }
        );
        facility_project_ids_with_project_tasks = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.PROJECT_TASKS) {
              return s.facility_project_id;
            }
          })
        );
        facility_project_ids_with_project_issues = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.PROJECT_ISSUES) {
              return s.facility_project_id;
            }
          })
        );
        facility_project_ids_with_project_risks = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.PROJECT_RISKS) {
              return s.facility_project_id;
            }
          })
        );
        facility_project_ids_with_project_lessons = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.PROJECT_LESSONS) {
              return s.facility_project_id;
            }
          })
        );
        facility_project_ids_with_project_notes = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.PROJECT_NOTES) {
              return s.facility_project_id;
            }
          })
        );
      }

      let project_contract_ids_with_contract_tasks = [];
      let project_contract_ids_with_contract_issues = [];
      let project_contract_ids_with_contract_risks = [];
      let project_contract_ids_with_contract_lessons = [];
      let project_contract_ids_with_contract_notes = [];

      if (authorized_project_contract_ids.length > 0) {
        sql_result = await sequelize.query(
          "SELECT distinct(project_contract_id), role_type FROM `role_users` INNER JOIN `roles` ON `roles`.`id` = `role_users`.`role_id` INNER JOIN `role_privileges` ON `role_privileges`.`role_id` = `roles`.`id` WHERE `role_users`.`user_id` = 1 AND (role_privileges.privilege REGEXP '^[RWD]' and role_users.project_contract_id in (:project_contract_ids))",
          {
            replacements: { project_contract_ids: authorized_project_contract_ids },
            type: QueryTypes.SELECT,
          }
        );

        project_contract_ids_with_contract_tasks = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.CONTRACT_TASKS) {
              return s.project_contract_id;
            }
          })
        );
        project_contract_ids_with_contract_issues = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.CONTRACT_ISSUES) {
              return s.project_contract_id;
            }
          })
        );
        project_contract_ids_with_contract_risks = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.CONTRACT_RISKS) {
              return s.project_contract_id;
            }
          })
        );
        project_contract_ids_with_contract_lessons = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.CONTRACT_LESSONS) {
              return s.project_contract_id;
            }
          })
        );
        project_contract_ids_with_contract_notes = compactAndUniq(
          _.map(sql_result, function (s) {
            if (s.role_type == db.RolePrivilege.CONTRACT_NOTES) {
              return s.project_contract_id;
            }
          })
        );
      }

      let project_contract_vehicle_ids_with_contract_tasks = [];
      let project_contract_vehicle_ids_with_contract_issues = [];
      let project_contract_vehicle_ids_with_contract_risks = [];
      let project_contract_vehicle_ids_with_contract_notes = [];

      if (authorized_project_contract_vehicle_ids.length > 0) {
        sql_result = await sequelize.query(
          "SELECT distinct(project_contract_vehicle_id), role_type FROM `role_users` INNER JOIN `roles` ON `roles`.`id` = `role_users`.`role_id` INNER JOIN `role_privileges` ON `role_privileges`.`role_id` = `roles`.`id` WHERE `role_users`.`user_id` = 1 AND (role_privileges.privilege REGEXP '^[RWD]' and role_users.project_contract_vehicle_id in (:project_contract_vehicle_ids))",
          {
            replacements: { project_contract_vehicle_ids: authorized_project_contract_vehicle_ids },
            type: QueryTypes.SELECT,
          }
        );

        project_contract_vehicle_ids_with_contract_tasks = _.uniq(
          _.compact(
            _.map(sql_result, function (s) {
              if (s.role_type == db.RolePrivilege.CONTRACT_TASKS) {
                return s.project_contract_vehicle_id;
              }
            })
          )
        );
        project_contract_vehicle_ids_with_contract_issues = _.uniq(
          _.compact(
            _.map(sql_result, function (s) {
              if (s.role_type == db.RolePrivilege.CONTRACT_ISSUES) {
                return s.project_contract_vehicle_id;
              }
            })
          )
        );
        project_contract_vehicle_ids_with_contract_risks = _.uniq(
          _.compact(
            _.map(sql_result, function (s) {
              if (s.role_type == db.RolePrivilege.CONTRACT_RISKS) {
                return s.project_contract_vehicle_id;
              }
            })
          )
        );
        project_contract_vehicle_ids_with_contract_notes = _.uniq(
          _.compact(
            _.compact(
              _.map(sql_result, function (s) {
                if (s.role_type == db.RolePrivilege.CONTRACT_NOTES) {
                  return s.project_contract_vehicle_id;
                }
              })
            )
          )
        );
      }

      // Facilities
      response.facilities = [];
      let facility_projects = await db.FacilityProject.findAll({
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
          "IssueId",
        ],
        where: { project_id: this.id, id: authorized_facility_project_ids },
      });
      let facility_project_ids = _.uniq(
        _.map(facility_projects, function (f) {
          return f.id;
        })
      );
      let facility_ids = _.uniq(
        _.map(facility_projects, function (f) {
          return f.facility_id;
        })
      );
      let facility_group_ids = _.uniq(
        _.map(facility_projects, function (f) {
          return f.facility_group_id;
        })
      );

      all_notes = await db.Note.findAll({ where: { noteable_id: facility_project_ids_with_project_notes, noteable_type: "FacilityProject" } });

      let all_facilities = await db.Facility.findAll({ where: { id: facility_ids, status: 1 } });
      let all_facility_groups = await db.FacilityGroup.findAll({ where: { id: facility_group_ids } });
      let facility_projects_hash2 = {};

      for (var facility_project of facility_projects) {
        let facility = _.find(all_facilities, function (f) {
          return f.id == facility_project.facility_id;
        });
        let facility_group = _.find(all_facility_groups, function (f) {
          return f.id == facility_project.facility_group_id;
        });

        let facility_hash = facility_project.toJSON();
        facility_hash["facility_project_id"] = facility_project.id;
        facility_hash["class"] = "FacilityProject";
        let facility_status = await db.Status.findAll({ where: { id: facility_project.status_id } });
        if (facility_status) {
          facility_hash["project_status"] = facility_status.name;
        }
        facility_hash["facility_name"] = facility.dataValues.facility_name;
        facility_hash["facility"] = facility.toJSON();
        let fg_hash = facility_group.toJSON();
        facility_hash["facility"]["facility_group_id"] = fg_hash["id"];
        facility_hash["facility"]["facility_group_name"] = fg_hash["name"];
        facility_hash["facility"]["facility_group_status"] = fg_hash["status"];
        // facility_hash['facility']["status"] = facility_hash['facility']["status"]
        facility_hash["facility"]["project_id"] = this.id;

        // facility_project_ids.push(facility_project.id)
        facility_ids.push(facility_project.facility_id);

        // Adding Task Data
        // facility_hash.facility = await facility_project.getFacility()
        facility_hash.tasks = [];

        var tasks = await db.Task.findAll({ where: { facility_project_id: facility_project.id } });
        all_tasks = all_tasks.concat(tasks);
        var task_ids = _.uniq(
          tasks.map(function (e) {
            return e.id;
          })
        );
        var checklists = await db.Checklist.findAll({ where: { listable_id: task_ids, listable_type: "Task" } });
        var checklist_ids = _.uniq(
          checklists.map(function (e) {
            return e.id;
          })
        );
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var task of tasks) {
          let _task = await task.toJSON();
          facility_hash.tasks.push(_task);
        }

        // Adding issues data
        facility_hash.issues = [];

        var issues = await db.Issue.findAll({ where: { facility_project_id: facility_project.id } });
        all_issues = all_issues.concat(issues);
        var issue_ids = issues.map(function (e) {
          return e.id;
        });
        var checklists = await db.Checklist.findAll({ where: { listable_id: issue_ids, listable_type: "Issue" } });
        var checklist_ids = checklists.map(function (e) {
          return e.id;
        });
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var issue of issues) {
          let _issue = await issue.toJSON();
          facility_hash.issues.push(_issue);
        }

        // Adding risk data
        facility_hash.risks = [];

        var risks = await db.Risk.findAll({ where: { facility_project_id: facility_project.id } });
        all_risks = all_risks.concat(risks);
        var risk_ids = risks.map(function (e) {
          return e.id;
        });
        var checklists = await db.Checklist.findAll({ where: { listable_id: risk_ids, listable_type: "Risk" } });
        var checklist_ids = checklists.map(function (e) {
          return e.id;
        });
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var risk of risks) {
          let _risk = await risk.toJSON();
          facility_hash.risks.push(_risk);
        }

        // facility_hash.risks = await db.Risk.findAll({where: {facility_project_id: facility_project_ids} })

        //Adding notes
        facility_hash.notes = [];
        for (var note of all_notes) {
          if (note.noteable_id == facility_project.id && note.noteable_type == "FacilityProject") {
            facility_hash.notes.push(await note.toJSON());
          }
        }
        response.facilities.push(facility_hash);
        facility_projects_hash2[facility_project.id] = facility_hash;
      }

      let all_user_ids = [];
      let all_task_user_ids = _.uniq(
        _.map(all_tasks, function (t) {
          return t.id;
        })
      );
      let all_task_users = await db.TaskUser.findAll({ where: { task_id: all_task_user_ids } });
      all_user_ids = _.uniq(
        all_user_ids.concat(
          _.map(all_task_users, function (tu) {
            return tu.user_id;
          })
        )
      );

      let all_issue_user_ids = _.uniq(
        _.map(all_issues, function (t) {
          return t.id;
        })
      );
      let all_issue_users = await db.IssueUser.findAll({ where: { issue_id: all_issue_user_ids } });
      all_user_ids = all_user_ids.concat(
        _.map(all_issue_users, function (iu) {
          return iu.user_id;
        })
      );

      let all_risk_user_ids = _.uniq(
        _.map(all_risks, function (t) {
          return t.id;
        })
      );
      let all_risk_users = await db.RiskUser.findAll({ where: { risk_id: all_risk_user_ids } });
      all_user_ids = _.uniq(
        all_user_ids.concat(
          _.map(all_risk_users, function (ru) {
            return ru.user_id;
          })
        )
      );

      response.users = await db.User.findAll({
        where: { id: all_user_ids },
        attributes: ["id", "email", "first_name", "last_name", "title", "phone_number", "status", "full_name"],
      });
      response.project_users = await this.getProjectUsers();

      // Contracts
      let project_contracts = await db.ProjectContract.findAll({
        attributes: [
          "id",
          "project_id",
          "contract_project_datum_id",
          "user_id",
          "facility_group_id",
          "progress",
          "ContractProjectDatumId",
          "created_at",
          "updated_at",
          "ProjectId",
        ],
        where: { project_id: this.id, id: authorized_project_contract_ids },
      });
      let project_contract_ids = authorized_project_contract_ids;
      let contract_project_datum_ids = _.uniq(
        _.map(project_contracts, function (pc) {
          return pc.contract_project_datum_id;
        })
      );
      let all_contract_project_data = await db.ContractProjectDatum.findAll({ where: { id: contract_project_datum_ids } });

      response.contracts = [];

      var contract_hash = [];
      var project_contract_hash2 = {};
      for (var project_contract of project_contracts) {
        let c = _.find(all_contract_project_data, function (cpd) {
          return cpd.id == project_contract.contract_project_datum_id;
        });
        let c_hash = await c.toJSON({ project_contract: project_contract });

        //Adding tasks
        c_hash.tasks = [];
        var tasks = await db.Task.findAll({ where: { project_contract_id: project_contract.id } });
        all_tasks = all_tasks.concat(tasks);
        var task_ids = _.uniq(
          tasks.map(function (e) {
            return e.id;
          })
        );
        var checklists = await db.Checklist.findAll({ where: { listable_id: task_ids, listable_type: "Task" } });
        var checklist_ids = _.uniq(
          checklists.map(function (e) {
            return e.id;
          })
        );
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var task of tasks) {
          let _task = await task.toJSON();
          c_hash.tasks.push(_task);
        }

        // Adding issues data
        c_hash.issues = [];

        var issues = await db.Issue.findAll({ where: { project_contract_id: project_contract.id } });
        all_issues = all_issues.concat(issues);
        var issue_ids = issues.map(function (e) {
          return e.id;
        });
        var checklists = await db.Checklist.findAll({ where: { listable_id: issue_ids, listable_type: "Issue" } });
        var checklist_ids = checklists.map(function (e) {
          return e.id;
        });
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var issue of issues) {
          let _issue = await issue.toJSON();
          c_hash.issues.push(_issue);
        }

        // Adding risk data
        c_hash.risks = [];

        var risks = await db.Risk.findAll({ where: { project_contract_id: project_contract.id } });
        all_risks = all_risks.concat(risks);
        var risk_ids = risks.map(function (e) {
          return e.id;
        });
        var checklists = await db.Checklist.findAll({ where: { listable_id: risk_ids, listable_type: "Risk" } });
        var checklist_ids = checklists.map(function (e) {
          return e.id;
        });
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var risk of risks) {
          let _risk = await risk.toJSON();
          c_hash.risks.push(_risk);
        }

        project_contract_hash2[project_contract.id] = c_hash;

        response.contracts.push(c_hash);
      }

      // Contract Vehicles
      let all_project_contract_vehicles = await db.ProjectContractVehicle.findAll({
        where: { project_id: this.id, id: authorized_project_contract_vehicle_ids },
      }); //await this.getProjectContractVehicles()
      let contract_vehicle_ids = _.uniq(
        _.map(all_project_contract_vehicles, function (pc) {
          return pc.contract_vehicle_id;
        })
      );
      let all_contract_vehicles = await db.ContractVehicle.findAll({ where: { id: contract_vehicle_ids } });

      response.contract_vehicles = [];
      var contract_vehicle_hash = [];
      var project_contract_vehicle_hash2 = {};
      for (var project_contract_vehicle of all_project_contract_vehicles) {
        var c = _.find(all_contract_vehicles, function (cpd) {
          return cpd.id == project_contract_vehicle.contract_vehicle_id;
        });
        let c_hash = c.toJSON();

        //Adding tasks
        c_hash.tasks = [];
        var tasks = await db.Task.findAll({ where: { project_contract_vehicle_id: project_contract_vehicle.id } });
        all_tasks = all_tasks.concat(tasks);
        var task_ids = _.uniq(
          tasks.map(function (e) {
            return e.id;
          })
        );
        var checklists = await db.Checklist.findAll({ where: { listable_id: task_ids, listable_type: "Task" } });
        var checklist_ids = _.uniq(
          checklists.map(function (e) {
            return e.id;
          })
        );
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var task of tasks) {
          let _task = await task.toJSON();
          c_hash.tasks.push(_task);
        }

        // Adding issues data
        c_hash.issues = [];

        var issues = await db.Issue.findAll({ where: { project_contract_vehicle_id: project_contract_vehicle.id } });
        all_issues = all_issues.concat(issues);
        var issue_ids = issues.map(function (e) {
          return e.id;
        });
        var checklists = await db.Checklist.findAll({ where: { listable_id: issue_ids, listable_type: "Issue" } });
        var checklist_ids = checklists.map(function (e) {
          return e.id;
        });
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var issue of issues) {
          let _issue = await issue.toJSON();
          c_hash.issues.push(_issue);
        }

        // Adding risk data
        c_hash.risks = [];

        var risks = await db.Risk.findAll({ where: { project_contract_vehicle_id: project_contract_vehicle.id } });
        all_risks = all_risks.concat(risks);
        var risk_ids = risks.map(function (e) {
          return e.id;
        });
        var checklists = await db.Checklist.findAll({ where: { listable_id: risk_ids, listable_type: "Risk" } });
        var checklist_ids = checklists.map(function (e) {
          return e.id;
        });
        var progress_lists = await db.ProgressList.findAll({ where: { checklist_id: checklist_ids } });

        for (var risk of risks) {
          let _risk = await risk.toJSON();
          c_hash.risks.push(_risk);
        }
        project_contract_vehicle_hash2[project_contract_vehicle.id] = c_hash;
        response.contract_vehicles.push(c_hash);
      }

      // Facility Groups
      response.facility_groups = []; //_.uniqWith(facility_groups, function(x,y){ return x.id == y.id} );

      let all_facility_group_ids = _.uniq(
        _.map(facility_projects.concat(project_contracts), function (fp) {
          return fp.facility_group_id;
        })
      );
      let project_facility_groups = await this.getProjectFacilityGroups();

      all_facility_group_ids = _.uniq(
        all_facility_group_ids.concat(
          _.map(project_facility_groups, function (fp) {
            return fp.facility_group_id;
          })
        )
      );
      let facility_groups = await db.FacilityGroup.findAll({ where: { id: all_facility_group_ids } });

      for (var facility_group of facility_groups) {
        let facility_group_hash = facility_group.toJSON();

        facility_group_hash["facilities"] = [];
        let fg_facility_projects = _.filter(facility_projects, function (e) {
          return e.facility_group_id == facility_group.id;
        });
        for (var fg_fp of fg_facility_projects) {
          if (facility_projects_hash2[fg_fp.id]) {
            facility_group_hash["facilities"].push(facility_projects_hash2[fg_fp.id]);
          }
        }

        facility_group_hash["contracts"] = [];
        facility_group_hash["contract_project_ids"] = [];
        let fg_projects_contracts = _.filter(project_contracts, function (e) {
          return e.facility_group_id == facility_group.id;
        });
        for (var fg_pc of fg_projects_contracts) {
          if (project_contract_hash2[fg_pc.id]) {
            facility_group_hash["contracts"].push(project_contract_hash2[fg_pc.id]);
          }
          facility_group_hash["contract_project_ids"].push(fg_pc.project_id);
        }
        facility_group_hash["project_ids"] = [this.id]; //_.uniq(_.map(fg_facility_projects, function(e){return e.project_id}))

        facility_group_hash["contract_vehicles"] = [];
        facility_group_hash["contract_vehicle_ids"] = [];

        let fg_projects_contract_vehicles = _.filter(all_project_contract_vehicles, function (e) {
          return e.facility_group_id == facility_group.id;
        });
        for (var fg_pcv of fg_projects_contract_vehicles) {
          if (project_contract_vehicle_hash2[fg_pcv.id]) {
            facility_group_hash["contract_vehicles"].push(project_contract_vehicle_hash2[fg_pcv.id]);
          }
          facility_group_hash["contract_vehicle_ids"].push(fg_pcv.project_id);
        }

        response.facility_groups.push(facility_group_hash);
      }

      // statues
      let all_statues = await this.getProjectStatuses();
      let all_status_ids = _.uniq(
        _.map(all_statues, function (fp) {
          return fp.status_id;
        })
      );
      response.statuses = await db.Status.findAll({ where: { id: all_status_ids } });
      response.task_types = await db.TaskType.findAll(); // await this.getTaskTypes()
      response.issue_types = await db.IssueType.findAll(); //await this.getIssueTypes()
      response.issue_severities = await db.IssueSeverity.findAll(); //await this.getIssueSeverities()
      response.task_stages = await db.TaskStage.findAll(); //await this.getTaskStages()
      response.issue_stages = await db.IssueStage.findAll(); //await this.getIssueStages()
      response.risk_stages = await db.RiskStage.findAll(); //await this.getRiskStages()
      response.lesson_stages = await db.LessonStage.findAll(); //await this.getLessonStages()

      response.contract_types = await db.ContractType.findAll();
      response.contract_statues = await db.ContractStatus.findAll();
      response.contract_customers = await db.ContractCustomer.findAll();
      response.contract_vehicle_numbers = await db.ContractVehicleNumber.findAll();
      response.contract_numbers = await db.ContractNumber.findAll();
      response.subcontract_numbers = await db.SubcontractNumber.findAll();
      response.contract_primes = await db.ContractPrime.findAll();
      response.contract_current_pops = await db.ContractCurrentPop.findAll();
      response.contract_classifications = await db.ContractClassification.findAll();

      return response;
    }
  }
  Project.init(
    {
      name: { type: DataTypes.STRING },
      description: DataTypes.TEXT,
      uuid: DataTypes.STRING,
      project_type_id: DataTypes.STRING,
      status: DataTypes.STRING,
      progress: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "projects",
      modelName: "Project",
      underscored: true,
    }
  );
  return Project;
};
