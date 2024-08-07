"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContractVehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      this.belongsTo(models.ContractSubCategory, { foreignKey: "contract_sub_category_id" });
      this.belongsTo(models.ContractAgency, { foreignKey: "contract_agency_id" });
      this.belongsTo(models.ContractVehicleType, { foreignKey: "contract_vehicle_type_id" });
      this.belongsTo(models.ContractNumber, { foreignKey: "contract_number_id" });
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.hasMany(models.ContractProjectDatum, { foreignKey: "contract_vehicle_id" });
      this.hasMany(models.ContractProjectPocResource, {
        foreignKey: "resource_id",
        constraints: false,
        scope: {
          resource_type: "ContractVehicle",
        },
      });
      this.hasMany(models.ProjectContractVehicle);
      this.belongsToMany(models.Project, { through: models.ProjectContractVehicle, foreignKey: "contract_vehicle_id" });
      // this.hasMany(models.ContractProjectPocResource);
      // this.belongsToMany(models.ContractProjectPoc,{through: models.ContractProjectPocResource, foreignKey: '', otherKey: '' })
    }
    to_JSON() {
      let _resource = this.get({ plain: true });
      return _resource;
    }
    async toJSON() {
      const { db } = require("./index.js");
      let _response = this.get({ plain: true });
      _response.contract_sub_category = await this.getContractSubCategory();
      _response.contract_agency = await this.getContractAgency();
      _response.contract_vehicle_type = await this.getContractVehicleType();
      _response.contract_number = await this.getContractNumber();
      _response.co_contract_poc_ids = [];
      _response.gov_contract_poc_ids = [];
      _response.pm_contract_poc_ids = [];

      const contractProjectPocResources = await db.ContractProjectPocResource.findAll({
        where: { resource_type: "ContractVehicle", resource_id: this.id },
        raw: true,
      });
      // _resource.contractProjectPocResources = contractProjectPocResources
      const coContractPocIds = contractProjectPocResources
        .filter((c) => c.poc_type === db.ContractProjectPoc.CONTRACT_OFFICE_POC_TYPE)
        .map((c) => c.contract_project_poc_id)
        .filter(Boolean);
      const govContractPocIds = contractProjectPocResources
        .filter((c) => c.poc_type === db.ContractProjectPoc.GOVERNMENT_POC_TYPE)
        .map((c) => c.contract_project_poc_id)
        .filter(Boolean);
      const pmContractPocIds = contractProjectPocResources
        .filter((c) => c.poc_type === db.ContractProjectPoc.PROGRAM_MANAGER_POC_TYPE)
        .map((c) => c.contract_project_poc_id)
        .filter(Boolean);

      _response.co_contract_poc_ids = coContractPocIds;
      _response.gov_contract_poc_ids = govContractPocIds;
      _response.pm_contract_poc_ids = pmContractPocIds;

      return _response;
    }
    async addContractPocs(_contract_poc_ids, poc_type) {
      if (!_contract_poc_ids) return;
    }
    static async createOrUpdateContractVehicle(body, user) {
      const { db } = require("./index.js");

      const contractParms = body;
      const cParams = { ...contractParms };
      let contractVehicle;
      if (cParams.contract_vehicle.id) {
        console.log("contractVehicle-");
        contractVehicle = await this.findByPk(cParams.contract_vehicle.id);
        console.log("contractVehicle-", contractVehicle);
      } else {
        contractVehicle = this.build();
      }
      let transaction = await sequelize.transaction();
      if (cParams.contract_vehicle.contract_number_id) {
        console.log("---", cParams.contract_vehicle.contract_number_id);
        let contractNumber = await db.ContractNumber.findOne({ where: { name: cParams.contract_vehicle.contract_number_id }, transaction });
        if (!contractNumber) {
          contractNumber = await db.ContractNumber.create(
            {
              name: cParams.contract_vehicle.contract_number_id,
              user_id: user.id,
            },
            { transaction }
          );
        }
        cParams.contract_vehicle.contract_number_id = contractNumber.id;
      }
      if (cParams.contract_vehicle.contract_sub_category_id) {
        const subCategoryId = parseInt(cParams.contract_vehicle.contract_sub_category_id, 10);
        if (isNaN(subCategoryId) || !(await db.ContractSubCategory.findByPk(subCategoryId, { transaction }))) {
          const subCategory = await db.ContractSubCategory.create(
            {
              name: cParams.contract_vehicle.contract_sub_category_id,
              user_id: user.id,
            },
            { transaction }
          );
          cParams.contract_vehicle.contract_sub_category_id = subCategory.id;
        }
      }
      if (cParams.contract_vehicle.contract_agency_id) {
        const agencyId = parseInt(cParams.contract_vehicle.contract_agency_id, 10);
        if (isNaN(agencyId) || !(await db.ContractAgency.findByPk(agencyId, { transaction }))) {
          const agency = await db.ContractAgency.create(
            {
              name: cParams.contract_vehicle.contract_agency_id,
              user_id: user.id,
            },
            { transaction }
          );
          cParams.contract_vehicle.contract_agency_id = agency.id;
        }
      }
      if (cParams.contract_vehicle.contract_vehicle_type_id) {
        const vehicleId = parseInt(cParams.contract_vehicle.contract_vehicle_type_id, 10);
        if (isNaN(vehicleId) || !(await db.ContractVehicleType.findByPk(vehicleId, { transaction }))) {
          const vehicleType = await db.ContractVehicleType.create(
            {
              name: cParams.contract_vehicle.contract_vehicle_type_id,
              user_id: user.id,
            },
            { transaction }
          );
          cParams.contract_vehicle.contract_vehicle_type_id = vehicleType.id;
        }
      }
      contractVehicle.setAttributes(cParams.contract_vehicle);
      contractVehicle.user_id = user.id;
      await contractVehicle.save();
      await addContractPocs(contractVehicle, cParams.contract_vehicle.pm_contract_poc_ids, db.ContractProjectPoc.PROGRAM_MANAGER_POC_TYPE);
      await addContractPocs(contractVehicle, cParams.contract_vehicle.gov_contract_poc_ids, db.ContractProjectPoc.GOVERNMENT_POC_TYPE);
      await addContractPocs(contractVehicle, cParams.contract_vehicle.co_contract_poc_ids, db.ContractProjectPoc.CONTRACT_OFFICE_POC_TYPE);
      return contractVehicle;
    }
  }
  async function addContractPocs(contractVehicle, contractPocIds = [], pocType, transaction) {
    const { db } = require("./index.js");

    console.log("---hi", contractPocIds.length, contractPocIds);
    if (!contractPocIds.length) return;

    const newPocIds = contractPocIds.map((id) => parseInt(id, 10));

    // Find existing POC IDs for the given type
    const oldPocResources = await db.ContractProjectPocResource.findAll({
      where: { resource_id: contractVehicle.id, resource_type: "ContractVehicle", poc_type: pocType },
      attributes: ["contract_project_poc_id"],
      transaction,
    });
    const oldPocIds = oldPocResources.map((resource) => resource.contract_project_poc_id);

    // Calculate new and removed POC IDs
    const toAdd = newPocIds.filter((id) => !oldPocIds.includes(id));
    const toRemove = oldPocIds.filter((id) => !newPocIds.includes(id));

    // Add new POCs
    if (toAdd.length) {
      const newPocResources = toAdd.map((pocId) => ({
        resource_id: contractVehicle.id,
        resource_type: "ContractVehicle",
        contract_project_poc_id: pocId,
        poc_type: pocType,
      }));
      await db.ContractProjectPocResource.bulkCreate(newPocResources, { transaction });
    }

    // Remove old POCs
    if (toRemove.length) {
      await db.ContractProjectPocResource.destroy({
        where: {
          resource_id: contractVehicle.id,
          resource_type: "ContractVehicle",
          poc_type: pocType,
          contract_project_poc_id: toRemove,
        },
        transaction,
      });
    }
  }
  ContractVehicle.init(
    {
      name: DataTypes.STRING,
      contract_sub_category_id: DataTypes.INTEGER,
      contract_agency_id: DataTypes.INTEGER,
      contract_vehicle_type_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      full_name: DataTypes.TEXT,
      ceiling: DataTypes.DECIMAL,
      base_period_start: DataTypes.DATE,
      base_period_end: DataTypes.DATE,
      option_period_start: DataTypes.DATE,
      option_period_end: DataTypes.DATE,
      contract_number_id: DataTypes.INTEGER,
      caf_fees: DataTypes.DECIMAL,
      subprime_name: DataTypes.TEXT,
      prime_name: DataTypes.TEXT,
      contract_name: DataTypes.TEXT,
      is_subprime: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "contract_vehicles",
      modelName: "ContractVehicle",
      underscored: true,
    }
  );
  return ContractVehicle;
};
