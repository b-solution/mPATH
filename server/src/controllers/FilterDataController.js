const { db } = require("../database/models");
const qs = require('qs');
const {_} = require("lodash") 
const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')

const { v4: uuidv4 } = require('uuid');

async function programAdminPrograms(req, res) {
  try {
    const responseJson = [];
    let user = await getCurrentUser(req.headers['x-token'])
    let programs = await user.programsWithProgramAdminRole()
    let programIds = compactAndUniq(_.map(programs, function(p){return p.id}))

    var _fps = await db.FacilityProject.findAll({
      where: { project_id: programIds },
      order: [['facility_group_id']],
      attributes: ['facility_group_id']
    })
    
    const facilityGroupIds = compactAndUniq(_.map(_fps, function(f){ return f.facility_group_id }));

    const facilityGroups = await db.FacilityGroup.findAll({
      where: { id: facilityGroupIds },
      attributes: ['id', 'name']
    });
    
    for (let program of programs) {
      let facilityProjects = program.getFacilityProjects({include: [db.Facility]})
      let facilityGroupIds = compactAndUniq(_.map(facilityProjects, function(fp){return fp.facility_group_id}))
      let facilityGroups = await db.FacilityGroup.findAll({where: {id: facilityGroupIds}})
      let projectsGroupByFacilityGroup = _.groupBy(facilityProjects, function(fp){return fp.facility_group_id})
      let transformProjectsGroupByFacilityGroupValues = []

      for(var [facilityGroupId, _facilityProjects] of Object.entries(projectsGroupByFacilityGroup)){
        transformProjectsGroupByFacilityGroupValues[facilityGroupId] = []
        for(var facilityProject of _facilityProjects){
          transformProjectsGroupByFacilityGroupValues[facilityGroupId].push({
            id: uuidv4(),
            project_id: facilityProject.facility_id,
            label: facilityProject.Facility.facility_name,
            facility_project_id: facilityProject.id
          })
        }
      }

      var projectChildren = []

      for(var [facilityGroupId, _facilities] of Object.entries(transformProjectsGroupByFacilityGroupValues)){
        var fg = _.find(facilityGroups, function(fg){ return fg.id == parseInt(facilityGroupId)})
        if(fg){
          fp_ids = compactAndUniq(_.map(_facilities, function(fp){return fp.facility_project_id}))
          projectChildren.push({
            id: uuidv4(),
            project_group_id: fg.id, 
            label: fg.name, 
            all_facility_project_ids: fp_ids, 
            children: _facilities })
        }
      }

      responseJson.push({
        id: uuidv4(),
        program_id: program.id,
        label: program.name,
        all_facility_project_ids: compactAndUniq(_.flatten(_.map(projectChildren, function(fp){return fp.all_facility_project_ids}))),
        children: projectChildren
      })
    }

    return({ portfolio_filters: responseJson });
  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

async function programs(req, res) {

  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    const responseJson = [];
    let user = await getCurrentUser(req.headers['x-token'])
    let programIds = []
    let options = {}
    if(params.project_id){
      options.project_ids = [params.project_id]
    }
    programIds = await user.authorizedProgramIds(options)
    let programs = await db.Project.findAll({where: {id: programIds}})

    var _fps = await db.FacilityProject.findAll({
      where: { project_id: programIds },
      order: [['facility_group_id']],
      attributes: ['facility_group_id']
    })
    
    const facilityGroupIds = compactAndUniq(_.map(_fps, function(f){ return f.facility_group_id }));

    const facilityGroups = await db.FacilityGroup.findAll({
      where: { id: facilityGroupIds },
      attributes: ['id', 'name']
    });
    
    for (let program of programs) {
      let facilityProjects = program.getFacilityProjects({include: [db.Facility]})
      let facilityGroupIds = compactAndUniq(_.map(facilityProjects, function(fp){return fp.facility_group_id}))
      let facilityGroups = await db.FacilityGroup.findAll({where: {id: facilityGroupIds}})
      let projectsGroupByFacilityGroup = _.groupBy(facilityProjects, function(fp){return fp.facility_group_id})
      let transformProjectsGroupByFacilityGroupValues = []

      for(var [facilityGroupId, _facilityProjects] of Object.entries(projectsGroupByFacilityGroup)){
        transformProjectsGroupByFacilityGroupValues[facilityGroupId] = []
        for(var facilityProject of _facilityProjects){
          transformProjectsGroupByFacilityGroupValues[facilityGroupId].push({
            id: uuidv4(),
            project_id: facilityProject.facility_id,
            label: facilityProject.Facility.facility_name,
            facility_project_id: facilityProject.id
          })
        }
      }

      var projectChildren = []

      for(var [facilityGroupId, _facilities] of Object.entries(transformProjectsGroupByFacilityGroupValues)){
        var fg = _.find(facilityGroups, function(fg){ return fg.id == parseInt(facilityGroupId)})
        if(fg){
          fp_ids = compactAndUniq(_.map(_facilities, function(fp){return fp.facility_project_id}))
          projectChildren.push({
            id: uuidv4(),
            project_group_id: fg.id, 
            label: fg.name, 
            all_facility_project_ids: fp_ids, 
            children: _facilities })
        }
      }

      responseJson.push({
        id: uuidv4(),
        program_id: program.id,
        label: program.name,
        all_facility_project_ids: compactAndUniq(_.flatten(_.map(projectChildren, function(fp){return fp.all_facility_project_ids}))),
        children: projectChildren
      })
    }

    return({ portfolio_filters: responseJson });
  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }

}

async function users(req, res) {
  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])

    let responseJson = []
    let projectIds = params.program_id ? [params.program_id] : await(user.authorizedProgramIds())
    let projectUsers = await db.ProjectUser.findAll({where: {user_id: user.id, project_id: projectIds}})
    let userIds = compactAndUniq(_.map(projectUsers, function(pu){ return pu.user_id }))
    let users = await db.User.findAll({where: {id: userIds, status: 1}})
    responseJson = _.map(users, function(u){ return {id: u.id, name: u.getFullName()} })

    return({users: responseJson})

  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}



async function statuses(req, res) {
  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])

    let responseJson = []
    let projectIds = params.program_id ? [params.program_id] : await(user.authorizedProgramIds())
    let projectStatuses = await db.ProjectStatus.findAll({where: {project_id: projectIds}})
    let statusIds = compactAndUniq(_.map(projectStatuses, function(pu){ return pu.status_id }))
    let users = await db.Status.findAll({where: {id: statusIds}})
    responseJson = _.map(users, function(u){ return {id: u.id, name: u.name} })

    return({statuses: responseJson})


  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}


async function categories(req, res) {
  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])

    let responseJson = []
    let projectIds = params.program_id ? [params.program_id] : await(user.authorizedProgramIds())
    let projectTaskTypes = await db.ProjectTaskType.findAll({where: {project_id: projectIds}})
    let taskTypeIds = compactAndUniq(_.map(projectTaskTypes, function(pu){ return pu.task_type_id }))
    let taskTypes = await db.TaskType.findAll({where: {id: taskTypeIds}})
    responseJson = _.map(taskTypes, function(u){ return {id: u.id, name: u.name} })
    return({categories: responseJson})


  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

async function stages(req, res) {
  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)
    let user = await getCurrentUser(req.headers['x-token'])

    let resourceName = params.resource || "task"
    let projectResourceStages = []
    let resourceStageIds = []
    let gProjectResourceStages = []
    let allStages = []
    let gResourceStages = []
    let programStages = {}
    let projectIds = params.program_id ? [params.program_id] : await(user.authorizedProgramIds())

    if(resourceName == "task"){

      projectResourceStages = await db.ProjectTaskStage.findAll({where: {project_id: projectIds}})
      resourceStageIds = compactAndUniq(_.map(projectResourceStages, function(pu){ return pu.task_stage_id }))
      gProjectResourceStages = _.groupBy(projectResourceStages, 'project_id')
      allStages = await db.TaskStage.findAll({where: {id: resourceStageIds}})
      gResourceStages = _.groupBy(allStages, 'id')

      for(var [_projectId, _projectResourceStages] of Object.entries(gProjectResourceStages)){
        programStages[_projectId] = []
        var tIds = compactAndUniq(_.map(_projectResourceStages, function(pu){ return pu.task_stage_id }))
        for(var tid of tIds){
          var ts = gResourceStages[tid]
          programStages[_projectId] = _.concat(programStages[_projectId], _.map(ts, function(t){return t.dataValues}));
          
        }
      }
    }else if(resourceName == "issue"){

      projectResourceStages = await db.ProjectIssueStage.findAll({where: {project_id: projectIds}})
      resourceStageIds = compactAndUniq(_.map(projectResourceStages, function(pu){ return pu.issue_stage_id }))
      gProjectResourceStages = _.groupBy(projectResourceStages, 'project_id')
      allStages = await db.IssueStage.findAll({where: {id: resourceStageIds}})
      gResourceStages = _.groupBy(allStages, 'id')

      for(var [_projectId, _projectResourceStages] of Object.entries(gProjectResourceStages)){
        programStages[_projectId] = []
        var tIds = compactAndUniq(_.map(_projectResourceStages, function(pu){ return pu.issue_stage_id }))
        for(var tid of tIds){
          var ts = gResourceStages[tid]
          programStages[_projectId] = _.concat(programStages[_projectId], _.map(ts, function(t){return t.dataValues}));
        }
      }

    }else if(resourceName == "risk"){

      projectResourceStages = await db.ProjectRiskStage.findAll({where: {project_id: projectIds}})
      resourceStageIds = compactAndUniq(_.map(projectResourceStages, function(pu){ return pu.risk_stage_id }))
      gProjectResourceStages = _.groupBy(projectResourceStages, 'project_id')
      allStages = await db.RiskStage.findAll({where: {id: resourceStageIds}})
      gResourceStages = _.groupBy(allStages, 'id')

      for(var [_projectId, _projectResourceStages] of Object.entries(gProjectResourceStages)){
        programStages[_projectId] = []
        var tIds = compactAndUniq(_.map(_projectResourceStages, function(pu){ return pu.risk_stage_id }))
        for(var tid of tIds){
          var ts = gResourceStages[tid]
          programStages[_projectId] = _.concat(programStages[_projectId], _.map(ts, function(t){return t.dataValues}));
        }
      }

    }else if(resourceName == "lesson"){
      projectResourceStages = await db.ProjectLessonStage.findAll({where: {project_id: projectIds}})
      resourceStageIds = compactAndUniq(_.map(projectResourceStages, function(pu){ return pu.lesson_stage_id }))
      gProjectResourceStages = _.groupBy(projectResourceStages, 'project_id')
      allStages = await db.LessonStage.findAll({where: {id: resourceStageIds}})
      gResourceStages = _.groupBy(allStages, 'id')

      for(var [_projectId, _projectResourceStages] of Object.entries(gProjectResourceStages)){
        programStages[_projectId] = []
        var tIds = compactAndUniq(_.map(_projectResourceStages, function(pu){ return pu.lesson_stage_id }))
        for(var tid of tIds){
          var ts = gResourceStages[tid]
          programStages[_projectId] = _.concat(programStages[_projectId], _.map(ts, function(t){return t.dataValues}));
        }
      }
    }

    return({program_stages: programStages, all_stages: allStages})


  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

async function issueTypes(req, res) {
  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])

    let responseJson = []
    let projectIds = params.program_id ? [params.program_id] : await(user.authorizedProgramIds())
    let projectIssueTypes = await db.ProjectIssueType.findAll({where: {project_id: projectIds}})
    let issueTypeIds = compactAndUniq(_.map(projectIssueTypes, function(pu){ return pu.issue_type_id }))
    let issueTypes = await db.IssueType.findAll({where: {id: issueTypeIds}})
    responseJson = _.map(issueTypes, function(u){ return {id: u.id, name: u.name} })
    return({issue_types: responseJson})


  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

async function issueSeverities(req, res) {
  try {

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])

    let responseJson = []
    let projectIds = params.program_id ? [params.program_id] : await(user.authorizedProgramIds())
    let projectIssueSeverities = await db.ProjectIssueSeverity.findAll({where: {project_id: projectIds}})
    let IssueSeverityIds = compactAndUniq(_.map(projectIssueSeverities, function(pu){ return pu.issue_severity_id }))
    let IssueSeverities = await db.IssueSeverity.findAll({where: {id: IssueSeverityIds}})
    responseJson = _.map(IssueSeverities, function(u){ return {id: u.id, name: u.name} })
    return({issue_severities: responseJson})


  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

async function riskApproaches(req, res) {
  try {

    responseJson = [
      {id: 'accept', name: 'Accept', value: 'accept'},
      {id: 'avoid', name: 'Avoid', value: 'avoid'},
      {id: 'mitigate', name: 'Mitigate', value: "mitigate"},
      {id: 'transfer', name: 'Transfer', value: "transfer"}
    ]
    return({risk_approaches: responseJson})


  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

async function riskPriorityLevel(req, res) {
  try {
    responseJson = [
      {id: 'very low', value: 'very low', name: 'Very Low 1'},
      {id: 'low', value: 'low', name: 'Low 2 - 3'},
      {id: 'moderate', value: 'moderate', name: 'Moderate 4 - 6'},
      {id: 'high', value: 'high', name: 'High 8 - 12'},
      {id: 'extreme', value: 'extreme', name: 'Extreme 15 - 25'}
    ]
    return({risk_priorities: responseJson})

  } catch (error) {
    res.status(500)
    return({ error: error.stack });
  }
}

module.exports = {
  programAdminPrograms,
  programs,riskPriorityLevel,
  riskApproaches,
  issueSeverities,
  issueTypes,
  stages,
  categories,
  statuses,
  users
};