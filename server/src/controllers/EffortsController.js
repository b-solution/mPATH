const { db } = require("../database/models");
const {_} = require("lodash") 
const {
  Op
} = require('sequelize');

const index = async(req, res) => {
  try {

    let facilityProject = await db.FacilityProject.findOne({where: {project_id: req.params.program_id, facility_id: req.params.project_id}})

    const allEfforts = await db.Effort.findAll({
      where: {
        facility_project_id: facilityProject.id,
        hours: { [Op.gt]: 0 }
      }
      // include: [{ model: User }, { model: FacilityProject, include: [Facility] }],
    });

    const allUsers = await db.User.findAll({ where: { id: allEfforts.map(effort => effort.user_id) } });
    const allTasks = await db.Task.findAll({ where: { facility_project_id: facilityProject.id } });

    const response = [];
    const groupedEfforts = _.groupBy(allEfforts, 'user_id');
    
    for (const [userId, userEfforts] of Object.entries(groupedEfforts)) {
      const user = allUsers.find(user => user.id === parseInt(userId));
      const tasks = [];
      
      for (const task of allTasks) {
        const taskEfforts = userEfforts.filter(effort => effort.resource_id === task.id) || [];
        var h =  await task.toJSON()
        h.efforts = []
        for(var e of taskEfforts){
          var ef = await e.toJSON()
          h.efforts.push(ef) 
        }
        
        h.actual_effort = taskEfforts.reduce((sum, effort) => sum + effort.hours, 0)
        tasks.push(h);
      }
      
      response.push({
        ...await(user.toJSON()),
        tasks
      });
    }
    return({ efforts: response })
  } catch (error) {
    res.status(500)
    // Handle the error
    console.error(error);
    return({ error: 'Error fetching efforts ' + error })
  }
}

const show = async(req, res) => {
  try {
    let effort = await db.Effort.findOne({where: {id: req.params.id } })

    return({effort: await effort.toJSON()});
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching effort " + error });
  }
}

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require('qs');
    let params = qs.parse(req.body)

    console.log("effort body", params)
    console.log("effort params", req.params)
    let effortParams = params.effort
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    let effort = db.Effort.build();
    let user = await getCurrentUser(req.headers['x-token'])

    let facilityProject = await db.FacilityProject.findOne({where: {project_id: req.params.program_id, facility_id: req.params.project_id}})
    effortParams.facility_project_id = facilityProject.id
    let tasks = await facilityProject.getTasks()
    var task_ids = _.map(tasks, function(t){ return t.id })

    if (!effortParams.task_id) {
      throw 'Task must be provided to enter time.';
    } else if (!task_ids.includes(parseInt(effortParams.task_id))) {
      throw 'Task must be part of project.';
    } else {
      effortParams.resource_id = effortParams.task_id;
      effortParams.resource_type = 'Task';
    }
  
    effort.date_of_week = effortParams.date_of_week ? new Date(effortParams.date_of_week) : null;
  
    effort.setAttributes(effortParams);
    var thisWeekDates = effort.thisWeekDates()
    effort.projected = effort.date_of_week > thisWeekDates[thisWeekDates.length - 1]
    await effort.save()

    return({effort: await effort.toJSON(), msg: "Effort created successfully" });
  } catch (error) {
    res.code(500)
    return({ error: "Error creating effort " + error });
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require('qs');
    let params = qs.parse(req.body)

    console.log("effort body", params)
    console.log("effort params", req.params)
    let effortParams = params.effort
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    let effort = await db.Effort.findOne({where: {id: req.params.id}});
    let user = await getCurrentUser(req.headers['x-token'])

    let facilityProject = await db.FacilityProject.findOne({where: {project_id: req.params.program_id, facility_id: req.params.project_id}})
    effortParams.facility_project_id = facilityProject.id
    let tasks = await facilityProject.getTasks()
    var task_ids = _.map(tasks, function(t){ return t.id })

    if (!effortParams.task_id) {
      throw 'Task must be provided to enter time.';
    } else if (!task_ids.includes(parseInt(effortParams.task_id))) {
      throw 'Task must be part of project.';
    } else {
      effortParams.resource_id = effortParams.task_id;
      effortParams.resource_type = 'Task';
    }
  
    effort.date_of_week = effortParams.date_of_week ? new Date(effortParams.date_of_week) : null;
  
    effort.setAttributes(effortParams);
    var thisWeekDates = effort.thisWeekDates()
    effort.projected = effort.date_of_week > thisWeekDates[thisWeekDates.length - 1]
    await effort.save()

    return({effort: await effort.toJSON(), msg: "Effort created successfully" });
  } catch (error) {
    res.code(500)
    return({ error: "Error updating effort " + error });
  }
};

module.exports = {
  index,
  update,
  show,
  create
};