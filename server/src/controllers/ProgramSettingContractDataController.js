const { db } = require("../database/models");

const getContractData = async (req, res) => {
  try {
    let h = {};
    h.contract_sub_categories = await db.ContractSubCategory.findAll({ attributes: ["id", "name"] }).then((subCategories) =>
      subCategories.map((sc) => sc.toJSON())
    );
    h.contract_agency = await db.ContractAgency.findAll({ attributes: ["id", "name"] }).then((contractAgencies) =>
      contractAgencies.map((ca) => ca.toJSON())
    );
    h.contract_vehicle_type = await db.ContractVehicleType.findAll({ attributes: ["id", "name"] }).then((contractVehicles) =>
      contractVehicles.map((cv) => cv.toJSON())
    );
    h.contract_award_tos = await db.ContractAwardTo.findAll({ attributes: ["id", "name"] }).then((contractAwards) =>
      contractAwards.map((ca) => ca.toJSON())
    );
    h.contract_naics = await db.ContractNaic.findAll({ attributes: ["id", "name"] }).then((contractNaics) => contractNaics.map((cn) => cn.toJSON()));
    h.contract_award_types = await db.ContractAwardType.findAll({ attributes: ["id", "name"] }).then((contractAwardTypes) =>
      contractAwardTypes.map((cav) => cav.toJSON())
    );
    h.contract_pocs = await db.ContractPoc.findAll({ attributes: ["id", "name"] }).then((contractPocs) => contractPocs.map((cp) => cp.toJSON()));
    h.contract_client_types = await db.ContractClientType.findAll({ attributes: ["id", "name"] }).then((contractClientTypes) =>
      contractClientTypes.map((cct) => cct.toJSON())
    );
    h.contract_types = await db.ContractType.findAll({ attributes: ["id", "name"] }).then((contractTypes) => contractTypes.map((ct) => ct.toJSON()));
    h.contract_status = await db.ContractStatus.findAll({ attributes: ["id", "name"] }).then((contractStatuses) =>
      contractStatuses.map((cs) => cs.toJSON())
    );
    h.contract_customers = await db.ContractCustomer.findAll({ attributes: ["id", "name"] }).then((contractCustomers) =>
      contractCustomers.map((cc) => cc.toJSON())
    );
    h.contract_vehicles = await db.ContractVehicle.findAll({ attributes: ["id", "name"] }).then((contractVehicles) =>
      contractVehicles.map((cv) => cv.to_JSON())
    );
    h.contract_vehicle_numbers = await db.ContractVehicleNumber.findAll({ attributes: ["id", "name"] }).then((contractVehicleNumbers) =>
      contractVehicleNumbers.map((cvm) => cvm.toJSON())
    );
    h.contract_numbers = await db.ContractNumber.findAll({ attributes: ["id", "name"] }).then((contractNumbers) =>
      contractNumbers.map((cn) => cn.toJSON())
    );
    h.sub_contract_numbers = await db.SubcontractNumber.findAll({ attributes: ["id", "name"] }).then((subContractNumbers) =>
      subContractNumbers.map((scn) => scn.toJSON())
    );
    h.contract_primes = await db.ContractPrime.findAll({ attributes: ["id", "name"] }).then((ContractPrimes) =>
      ContractPrimes.map((cp) => cp.toJSON())
    );
    h.contract_current_pops = await db.ContractCurrentPop.findAll({ attributes: ["id", "name"] }).then((ContractCurrentPops) =>
      ContractCurrentPops.map((ccp) => ccp.toJSON())
    );
    h.contract_classifications = await db.ContractClassification.findAll({ attributes: ["id", "name"] }).then((ContractClassifications) =>
      ContractClassifications.map((cc) => cc.toJSON())
    );
    h.contract_project_pocs = await db.ContractProjectPoc.findAll({ attributes: ["id", "name"] }).then((ContractProjectPocs) =>
      ContractProjectPocs.map((cp) => cp.toJSON())
    );
    return { h: h };
    console.log("h---", h);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getContractData,
};
