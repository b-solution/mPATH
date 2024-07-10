const { db } = require("../database/models");
const { _ } = require("lodash");
const { getCurrentUser } = require("../utils/helpers");

const show = async (req, res) => {
  try {
    let risk = await db.Risk.findOne({ where: { id: req.params.id } });
    return { risk: await risk.TO_JSON() };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching risk " + error };
  }
};

// Function for retrieving user details
const create = async (req, res) => {
  try {
    var qs = require("qs");
    console.log("risk body", req.body);
    console.log("risk params", req.params);
    let params = qs.parse(req.body);
    // const parts = await req.files();
    // console.log("************Files ", parts)

    // for await (const data of parts) {
    //   console.log("*******File being access**********");
    //   console.log(data.filename); // access file name
    // }
    let risk = db.Risk.build();
    let user = await getCurrentUser(req.headers["x-token"]);
    await risk.createOrUpdateRisk(params, { user: user, project_id: req.params.program_id, facility_id: req.params.project_id });
    console.log("new risk", risk);
    return { risk: await risk.TO_JSON(), msg: "Risk created successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching risk " + error };
  }
};
// Function for retrieving user details
const update = async (req, res) => {
  try {
    var qs = require("qs");
    console.log("risk params", qs.parse(req.body));
    let params = qs.parse(req.body);
    let riskParams = params;

    let risk = await db.Risk.findOne({ where: { id: req.params.id } });
    console.log("Risk---", risk, riskParams);
    riskParams["risk_approach"] = risk.getRiskApproachValue(riskParams["risk_approach"]);
    console.log("------", riskParams);
    risk.set(riskParams);
    await risk.save();

    await risk.assignUsers(params);
    await risk.manageNotes(riskParams);
    await risk.manageChecklists(riskParams);
    // await risk.addResourceAttachment(params);

    return { risk: await risk.TO_JSON(), msg: "Risk updated successfully" };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching riskParams " + error };
  }
};

const create_duplicate = async (req, res) => {
  try {
    const duplicatedRisk = await duplicateRisk(req.params.id, "");
    console.log("-------", duplicatedRisk);
    // const risk = await db.Risk.findByPk(req.params.id);
    // const riskData = risk.get({ plain: true });
    // delete riskData.id;
    // const duplicateRisk = await db.Risk.create(riskData);
    // await duplicateRisk.save();
    return { duplicateedRisk: await duplicatedRisk.TO_JSON(), message: "Duplicate Risk created successfully" };
  } catch (error) {
    return { message: error };
  }
};
async function duplicateRisk(id, newAttrs) {
  console.log("find risk---");

  let dupRiskData;
  const risk = await db.Risk.findByPk(id);
  console.log("find risk---", risk);
  const riskData = risk.get({ plain: true });
  if (newAttrs !== "") {
    if (newAttrs.facility_project_id) {
      dupRiskData = {
        ...riskData,
        facility_project_id: newAttrs.facility_project_id,
      };
    }
    if (newAttrs.project_contract_id) {
      dupRiskData = {
        ...riskData,
        project_contract_id: newAttrs.project_contract_id,
      };
    }
    if (newAttrs.project_contract_vehicle_id) {
      dupRiskData = {
        ...riskData,
        project_contract_vehicle_id: newAttrs.project_contract_vehicle_id,
      };
    }
  } else {
    dupRiskData = riskData;
  }
  console.log("hello0000=====", dupRiskData);
  delete dupRiskData.id;
  const duplicatedRisk = await db.Risk.create(dupRiskData);
  await duplicatedRisk.save();
  return duplicatedRisk;
}
const create_bulk_duplicate = async (req, res) => {
  const allObjs = [];
  try {
    var qs = require("qs");
    const body = qs.parse(req.body);
    console.log("body", body);
    if (body.facility_project_ids) {
      for (const fpId of body.facility_project_ids) {
        const newRisk = await duplicateRisk(req.params.id, { facility_project_id: fpId });
        console.log("new risk ----", newRisk);
        allObjs.push(newRisk);
      }
    }
    if (body.project_contract_ids) {
      for (const pCId of body.project_contract_ids) {
        const newRisk = await duplicateRisk(req.params.id, { project_contract_id: pCId });
        allObjs.push(newRisk);
      }
    }
    if (body.project_contract_vehicle_ids) {
      for (const pCVId of body.project_contract_vehicle_ids) {
        const newRisk = await duplicateRisk(req.params.id, { project_contract_vehicle_id: pCVId });
        console.log("new risk ----", newRisk);
        allObjs.push(newRisk);
      }
    }
    return {
      risks: allObjs.map((obj) => {
        return obj.dataValues;
      }),
      message: "Bulk duplicate risks created successfully",
    };
  } catch (error) {
    return { message: error };
  }
};
const batch_update = async (req, res) => {
  try {
    const params = req.params;
    const risks = await db.Risk.findAll({ where: { facility_project_id: params.project_id } });
    const existingRiskIds = risks.map((risk) => {
      return risk.id;
    });
    const risksIdsForUpdate = Object.keys(req.body);
    const validRiskIds = risksIdsForUpdate.filter((id) => {
      return existingRiskIds.includes(id);
    });
    for (const riskId of validRiskIds) {
      const updateData = req.body[riskId];
      await db.Risk.update(updateData, { where: { id: riskId } });
    }
    const facilityProject = await db.FacilityProject.findByPk(req.params.project_id);
    return { facilityProject: facilityProject.TO_JSON() };
  } catch (error) {
    return { message: error };
  }
};

module.exports = {
  update,
  show,
  create,
  create_duplicate,
  create_bulk_duplicate,
  batch_update,
};
