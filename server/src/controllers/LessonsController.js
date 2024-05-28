const { db } = require("../database/models");
const {_} = require("lodash") 
const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')
const qs = require('qs');

// Function for retrieving user details
const program_lessons = async (req, res) => {
  try {
    const { db } = require("../database/models");
    const {getCurrentUser, printParams, compactAndUniq} = require('../utils/helpers.js')

    var qs = require('qs');
    let query = qs.parse(req.query)
    let params = qs.parse(req.params)
    let noteParams = params.note

    var facilityProjects = await db.FacilityProject.findAll({where: {project_id: params.program_id}})
    var facilityProjectIds = compactAndUniq(_.map(facilityProjects, 'id'))
    var lessons = await db.Lesson.findAll({where: {facility_project_id: facilityProjectIds }})
    var response = []
    for(var l of lessons){
      var _l = await l.toJSON()
      response.push(_l)
    }
    return({ lessons: response });

  } catch (error) {
    res.code(500)
    return({ error: "Error fetching lessons"+ error.stack });
  }
};

// Function for retrieving user details
const index = async (req, res) => {
  var qs = require('qs');
  try {
    // Fetch user profile using req.userId
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    let body = qs.parse(req.body)
    let allLessons = []

    if(params.program_id && params.project_id){
      let program_id = params.program_id
      let facility_id = params.project_id
      let facility_project = await db.FacilityProject.findOne({where: {project_id: program_id, facility_id: facility_id}, raw: true})
      allLessons = await db.Lesson.findAll({where: {facility_project_id: facility_project.id}});
    }else if(params.project_contract_id){
      let project_contract = await db.ProjectContract.findOne({where: {id: params.project_contract_id}, raw: true})
      allLessons = await db.Lesson.findAll({where: {project_contract_id: project_contract.id}});
    }else if(params.project_contract_vehicle_id){
      let project_contract_vehicle = await db.ProjectContractVehicle.findOne({where: {id: params.project_contract_vehicle_id}, raw: true})
      allLessons = await db.Lesson.findAll({where: {project_contract_vehicle_id: project_contract_vehicle.id}});
    }

    let res_lessons = []
    for(var l of allLessons){
      res_lessons.push(await(l.toJSON()))
    }
    return({ lessons: res_lessons });

  } catch (error) {
    res.code(500)
    return({ error: "Error fetching lessons "+error.stack });
  }
};

const show = async(req, res) => {
  try {
    let lesson = await db.Lesson.findOne({where: {id: req.params.id } })

    return({lesson: await lesson.toJSON()});
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching lesson " + error.stack });
  }
};

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require('qs');
    const {getCurrentUser, printParams, compactAndUniq, serializeData, deserializeData} = require('../utils/helpers.js')

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let lesson = db.Lesson.build();
    
    let user = await getCurrentUser(req.headers['x-token'])
    await lesson.createOrUpdateLesson(body,{user: user, project_id: req.params.program_id, facility_id: req.params.project_id})

    return({lesson: await lesson.toJSON(), msg: "Lesson created successfully" });
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching lesson " + error.stack });
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require('qs');
    const {getCurrentUser, printParams, compactAndUniq, serializeData, deserializeData} = require('../utils/helpers.js')
    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let lessonParams = body.lesson

    let user = await getCurrentUser(req.headers['x-token'])
    let lesson = await db.Lesson.findOne({where: {id: req.params.id } })

    lesson.set(lessonParams)
    await lesson.save()

    await lesson.manageNotes(lessonParams)
    await lesson.addLessonDetail(lessonParams,user)
    await lesson.addResourceAttachment(body)

    return({lesson: await lesson.toJSON(), msg: "Lesson updated successfully" });
  } catch (error) {
    res.code(500)
    console.log(error.stack)
    return({ error: "Error fetching lessonParams " + error.stack });
  }
};

const count = async (req, res) => {

  try {
      const { db } = require("../database/models");

      let body = qs.parse(req.body)
      let params = qs.parse(req.params)
      let query = qs.parse(req.query)
      printParams(req)
      let responseHash = { total_count: 0, progress: 0, completed: 0, total_contract_lessons: 0 };

      let user = await getCurrentUser(req.headers['x-token'])
    
      let statusCode = 200;

      const authorizedProgramIds = await user.authorizedProgramIds();
      const projectId = parseInt(params.program_id);
      console.log("****** authorizedProgramIds", authorizedProgramIds)
      if (!projectId || !authorizedProgramIds.includes(projectId)) {
          throw new Error("Access Denied");
      }
      let authorizedData = await user.getAuthorizedData({project_ids: [projectId]})
      let authorizedFacilityProjectIds = authorizedData.authorized_facility_project_ids;
      let authorizedProjectContractIds = authorizedData.authorized_project_contract_ids;
      let authorizedProjectContractVehicleIds = authorizedData.authorized_project_contract_vehicle_ids;

      if (projectId && authorizedProgramIds.includes(parseInt(projectId))) {
          let lessonIds = [];
          let cLessonIds = [];

          if (authorizedProjectContractIds.length > 0) {
              var pcLessons = await db.Lesson.findAll({ where: { project_contract_id: authorizedProjectContractIds } })
              cLessonIds = _.map(pcLessons, function(f){ return f.id } )
          }

          if (authorizedProjectContractVehicleIds.length > 0) {
              var pvLessons = await db.Lesson.findAll({ where: { project_contract_vehicle_id: authorizedProjectContractVehicleIds } })
              cLessonIds = cLessonIds.concat(_.map(pvLessons, function(f){ return f.id } ))
          }

          if (authorizedFacilityProjectIds.length > 0) {
              lessonIds = await db.Lesson.findAll({ where: { facility_project_id: authorizedFacilityProjectIds } })

              let lessonsCount = lessonIds.length;
              let cLessonsCount = cLessonIds.length;
              let progress = lessonIds.filter(id => id.draft === true).length;
              let cLessonsProgress = cLessonIds.filter(id => id.draft === true).length;

              let completed = lessonsCount - progress;
              let cLessonsCompleted = cLessonsCount - cLessonsProgress;

              responseHash = { total_count: lessonsCount, progress: progress, completed: completed, total_contract_lessons: cLessonsCount };
          }
      } else if (projectId && query.facility_id) {
          let facilityProject = await db.FacilityProject.findOne({ where: { project_id: projectId, facility_id: query.facility_id } });
          if (facilityProject) {
              let lessonsCount = await db.Lesson.count({ where: { facility_project_id: facilityProject.id } });
              let progress = await db.Lesson.count({ where: { facility_project_id: facilityProject.id, draft: true } });
              let completed = lessonsCount - progress;
              responseHash = { total_count: lessonsCount, progress: progress, completed: completed };
          } else {
              throw new Error("Record Not Found");
          }
      } else {
          throw new Error("Bad Request");
      }

      res.status(statusCode)
      return(responseHash);
  } catch (error) {
      if (error.name === "SequelizeDatabaseError" || error.name === "SequelizeValidationError") {
          res.status(400)
          return({ error: error.stack });
      } else if (error.name === "SequelizeRecordNotFoundError") {
          res.status(404)
          return({ error: error.stack });
      } else {
          res.status(500)
          return({ error: error.stack });
      }
  }
  
    

}


module.exports = {
  index,show, program_lessons, update, create,count
};