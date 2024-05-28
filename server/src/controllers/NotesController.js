const { db } = require("../database/models");
const {_} = require("lodash") 

// Function for retrieving user details
const index = async (req, res) => {
  var qs = require('qs');
  try {
    // Fetch user profile using req.userId
    let params = qs.parse(req.params)
    let query = qs.parse(req.query)
    let body = qs.parse(req.body)
    let allNotes = []

    if(params.program_id && params.project_id){
      let program_id = params.program_id
      let facility_id = params.project_id
      let facility_project = await db.FacilityProject.findOne({where: {project_id: program_id, facility_id: facility_id}, raw: true})
      allNotes = await db.Note.findAll({where: {noteable_id: facility_project.id, noteable_type: 'FacilityProject'}});
    
    }else if(params.project_contract_id){
      let project_contract = await db.ProjectContract.findOne({where: {id: params.project_contract_id}, raw: true})
      allNotes = await db.Note.findAll({where: {noteable_id: project_contract.id, noteable_type: 'ProjectContract'}});
    
    }else if(params.project_contract_vehicle_id){
      let project_contract_vehicle = await db.ProjectContractVehicle.findOne({where: {id: params.project_contract_vehicle_id}, raw: true})
      allNotes = await db.Note.findAll({where: {projecnoteable_idt_contract_vehicle_id: project_contract_vehicle.id, noteable_type: 'ProjectContractVehicle'}});
    }

    let res_notes = []
    for(var l of allNotes){
      res_notes.push(await(l.toJSON()))
    }
    return({ notes: res_notes });

  } catch (error) {
    res.code(500)
    return({ error: "Error fetching lessons "+error });
  }
};

const show = async(req, res) => {
  try {
    let note = await db.Note.findOne({where: {id: req.params.id } })

    return({note: await note.toJSON()});
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching note " + error });
  }
}

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require('qs');
    console.log("note body", req.body)
    console.log("note params", req.params)
    let params = qs.parse(req.body)
    let noteParams = params.note
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    let note = db.Note.build();
    let user = await getCurrentUser(req.headers['x-token'])
    let facilityProject = await db.FacilityProject.findOne({where: {project_id: req.params.program_id, facility_id: req.params.project_id }})
    noteParams['noteable_id'] = facilityProject.id
    noteParams['noteable_type'] = 'FacilityProject'
    
    note.set(noteParams)
    await note.save()

    return({note: await note.toJSON(), msg: "Note created successfully" });
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching note " + error });
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require('qs');
    console.log("note params", qs.parse(req.body))
    let params = qs.parse(req.body)
    let noteParams = params.note
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    console.log("******note params", noteParams)
    let note = await db.Note.findOne({where: {id: req.params.id } })
    note.set(noteParams)
    note.user_id = 
    await note.save()

    await note.assignUsers(params)
    await note.manageNotes(noteParams)
    await note.manageChecklists(noteParams)

    return({note: await note.toJSON(), msg: "Note updated successfully" });
  } catch (error) {
    res.code(500)
    return({ error: "Error fetching note " + error });
  }
};

module.exports = {
  update,
  show,
  create,
  index
};