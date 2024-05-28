const { db } = require("../database/models");
const qs = require('qs');
const {_} = require("lodash") 
const { printParams, getCurrentUser } = require("../utils/helpers");

async function index(req, res) {
  try {
    let responseHash = {};

    let params = qs.parse(req.query)

    const allFacilityGroups = await db.FacilityGroup.findAll();
    responseHash.facility_groups = allFacilityGroups;
    
    if (params.project_id) {
      const project = await db.Project.findByPk(params.project_id);
      let project_groups = await db.ProjectFacilityGroup.findAll({where: {project_id: project.id}, raw: true})
      responseHash.program_group_ids = _.uniq(_.map(project_groups, function(pg){return pg.facility_group_id}))
    }
    return(responseHash)
  } catch (error) {
    res.status(500)
    return({ error: "Error fetching facility groups "+ error });
  }
}

async function create(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    let user = await getCurrentUser(req.headers['x-token'])
    const facilityGroup = db.FacilityGroup.build()
    facilityGroup.name = body.facility_group.name 
    facilityGroup.status = 1,
    facilityGroup.user_id = user.id,
    facilityGroup.owner_id = body.facility_group.project_id,
    facilityGroup.owner_type = 'Project'

    await facilityGroup.save()

    if (body.facility_group.project_id) {
      const project = await db.Project.findByPk(body.facility_group.project_id);
      let project_group = db.ProjectFacilityGroup.build({project_id: project.id, facility_group_id: facilityGroup.id })
      await project_group.save()
    }
    
    return({facilityGroup});
  } catch (error) {
    res.status(406)
    return({ error: "Error "+error });
  }
}

async function bulk_project_update(req, res) {
  try {
    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    const project = await db.Project.findByPk(body.project_id);
    const groups = await db.FacilityGroup.findAll({ where: { id: body.facility_group_ids } });
    let createProjectFacilityGroups = []
    for(var group of groups){
      createProjectFacilityGroups.push({project_id: project.id, facility_group_id: group.id})
    }
    if(createProjectFacilityGroups.length > 0){
      await db.ProjectFacilityGroup.bulkCreate(createProjectFacilityGroups);
    }
    return({groups});
  } catch (error) {
    res.status(500)
    return({ error: "Error "+error });
  }
}

async function update(req, res) {
  try {
    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)
    const group = await db.FacilityGroup.findByPk(params.id);
    await group.update(body.facility_group);
    return({group});

  } catch (error) {
    res.status(406)
    return({ errors: 'Error while updating groups' });
  }
}

async function destroy(req, res) {
  try {
    const { db } = require("../database/models");

    let body = qs.parse(req.body)
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    printParams(req)

    const group = await db.FacilityGroup.findByPk(params.id);
    const program = await db.Project.findByPk(body.project_id);
        
    const projectFacilityGroup = await db.ProjectFacilityGroup.findOne({ where: { project_id: program.id, facility_group_id: group.id } })
    
    if (!group.is_portfolio && !group.is_default) {
      await projectFacilityGroup.applyUnassigedToResources();
      await group.destroy();
      res.status(200)
      return({ message: 'Group removed successfully' });
    } else if (group.is_portfolio && !group.is_default) {
      await projectFacilityGroup.applyUnassigedToResources();
      await group.destroy();
      res.status(200)
      return({ message: 'Group removed successfully' });
    } else {
      res.status(406)
      return({ message: "Can't remove default group!" });
    }
  } catch (error) {
    res.status(406)
    return({ error: "Error "+error });
  }
}

module.exports = {
  index,
  create,
  bulk_project_update,
  update,
  destroy
};