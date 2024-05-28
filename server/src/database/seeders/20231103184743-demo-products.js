"use strict";

/** @type {import('sequelize-cli').Migration} */

const { db } = require("../models");
var bcrypt = require("bcrypt");
const process = require("dotenv").config();
const { cryptPassword } = require("../../utils/helpers");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    console.log("Creating User!!!!");
    const [user, ucreated] = await db.User.findOrCreate({
      where: { email: "admin@example.com" },
      defaults: {
        encrypted_password: await cryptPassword("adminPa$$w0rd"),
        title: "Mr.",
        first_name: "Super",
        role: 1,
        last_name: "Admin",
      },
    });

    if (ucreated) {
      console.log("User created successfully"); // This will certainly be 'Technical Lead JavaScript'
    } else if (user) {
      console.log("User already created");
    } else {
      console.log("Error creating user");
    }

    console.log("Creating FacilityGroup!!!!");
    const [facilityGroup, fgcreated] = await db.FacilityGroup.findOrCreate({
      where: { name: "Sample Group", code: "SAMP", status: 1 },
      defaults: {},
    });

    if (fgcreated) {
      console.log("FacilityGroup created successfully"); // This will certainly be 'Technical Lead JavaScript'
    } else if (user) {
      console.log("FacilityGroup already created");
    } else {
      console.log("Error creating FacilityGroup");
    }

    console.log("Creating Setting!!!!");
    const [setting, screated] = await db.Setting.findOrCreate({
      where: { google_map_key: "AIzaSyBO3g-tO4OkV0bTrtSh-BITITIZesnHAxs" },
      defaults: {},
    });

    if (screated) {
      console.log("setting created successfully"); // This will certainly be 'Technical Lead JavaScript'
    } else if (setting) {
      console.log("setting already created");
    } else {
      console.log("Error creating setting");
    }

    console.log("Adding Contract types");
    var contract_types = ["Prime Contract", "Non Prime contract", "Prime vehicles and ID IQs"];
    contract_types.forEach(async function (e) {
      const [contractType, ctcreated] = await db.ContractType.findOrCreate({
        where: { name: e },
        defaults: { user_id: user.id },
      });

      if (ctcreated) {
        console.log("contract type created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract type", e);
      }
    });

    console.log("Adding Contract Statues");
    var contract_statues = ["8A", "8(a)/ SDVOSB", "SDVOSB", "SB", "8(a)", "N/A"];
    contract_statues.forEach(async function (e) {
      const [contractStatus, cscreated] = await db.ContractStatus.findOrCreate({
        where: { name: e },
        defaults: {},
      });

      if (cscreated) {
        console.log("contract Statues created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract Statues", e);
      }
    });

    console.log("Adding Contract name customers");
    var contract_name_customers = [
      "VA",
      "IPO",
      "DHA",
      "3M",
      "DIA",
      "SEC",
      "Army",
      "USCG",
      "HHS/HRSA",
      "ARNG",
      "DHMS/DHA",
      "HRSA",
      "DOS",
      "SBA",
      "DOE",
    ];

    contract_name_customers.forEach(async function (e) {
      const [contractCustomer, cccreated] = await db.ContractCustomer.findOrCreate({
        where: { name: e },
        defaults: { user_id: user.id },
      });

      if (cccreated) {
        console.log("contract Customer created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract Customer", e);
      }
    });

    console.log("Adding Contract vehicles");
    var contract_vehicles = [
      "VAEHRM",
      "Connections II",
      "GSA IT-70 SIN 132-51",
      "T4NG",
      "8(a) STARS2",
      "GSA IT-70",
      "GSA PSS",
      "DIA ESITA 2",
      "WITS 3",
      "CIO-SP3 (SDVOSB)",
      "GAS",
      "GSA IT-70 SIN 132-56",
      "VETS 2 GWAC ",
      "TBA",
      "N/A",
    ];

    contract_vehicles.forEach(async function (e) {
      const [contractVehicle, cvcreated] = await db.ContractVehicle.findOrCreate({
        where: { name: e },
        defaults: { user_id: user.id },
      });

      if (cvcreated) {
        console.log("ContractVehicle created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating ContractVehicle", e);
      }
    });

    console.log("Adding Contract vehicle numbers");
    var contract_vehicle_numbers = [
      "0353-21-2545",
      "19AQMM19D0147",
      "36C10B18D5000",
      "36C10B20N0015",
      "36C10B20N0028",
      "47QRAA-18-D-0098",
      "GS00Q17GWD2387",
      "47QTCH18D0041",
      "GS11T08BJD6001",
      "GS-35F-0142W",
      "GS35F349CA",
      "GS-35F-413BA",
      "HHSN316201800023W",
      "HHM402-17-A-0007",
      "HT003821C0006",
      "VA118-16-D-1006",
      "N/A",
      "TBD",
    ];

    contract_vehicle_numbers.forEach(async function (e) {
      const [contractVehicleNumber, cccreated] = await db.ContractVehicleNumber.findOrCreate({
        where: { name: e },
      });

      if (cccreated) {
        console.log("contractVehicleNumber created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contractVehicleNumber", e);
      }
    });

    console.log("Adding Contract number");
    var contract_numbers = [
      "0353-21-2545/7335105102P0012",
      "19AQMM19D0147/19AQMM19F4405",
      "19AQMM19D0147/19AQMM20F0955",
      "19AQMM19D0147/19AQMM20F1904",
      "19AQMM19D0147/19AQMM20F2118",
      "36C10B18D5000",
      "36C10B19N0008",
      "36C19N0010",
      "36C10B19N0016",
      "36C10B19N0021",
      "36C10B20N0015",
      "36C10B20N0015EHRM",
      "36C10B20N0030",
      "36C10B20N0034",
      "36C10B20N0035",
      "36C10B20N0036",
      "36C10B20N10060037",
      "47QFSA20F0034",
      "47FWA19F0046",
      "47QTCH18D0041/47QFSA21F0005",
      "50310219A0005/50310219F0145",
      "50310219A0005/50310220F0086",
      "50310219A0005/50310220F0119",
      "75N98118D00023/70Z0G320FPMG00100",
      "89303020CMA00052",
      "GS00Q1700Q17GWD2387",
      "GS11T08BJD6001",
      "GS35F413BA/140D418F0001",
      "GS35F413BA175R60220F80134",
      "HHM402-17-A-0007/0008",
      "HHSH250201800032B/75R60220F34006",
      "HHSh25020180032b/75R60220F34007",
      "HQMMMBBX6",
      "HT001419C0023",
      "HT003821C0006",
      "Q-ACLD-19-SME-01",
      "VA118-16-F-1006-0012",
      "VA11817F10060016",
      "W81XWH18F0361",
      "W912DY-19-C-0018",
      "W9133L-21-C-1000",
      "TBA",
    ];

    contract_numbers.forEach(async function (e) {
      const [contractNumber, cncreated] = await db.ContractNumber.findOrCreate({
        where: { name: e },
        defaults: { user_id: user.id },
      });

      if (cncreated) {
        console.log("contract Customer created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract Customer", e);
      }
    });

    console.log("Adding sub Contract numbers");
    var subcontract_numbers = [
      "2016-004-T4NG-SC/POVAT4NG-016-006",
      "2016-004-T4NG-SC/PO-T4NG-037-002",
      "2017-006-T4NG-SC/POVAT4NG-012-003",
      "2018-001-DIA-SC/DIA-008-002",
      "2020-02",
      "AstraFireJV2019-004/AFJV202151",
      "GCMS41714",
      "IIS-2015-SUB002/2021-ARNG-1003",
      "MA-000789-2018/PO2TI0502-01",
      "MASI1-19-S-LH-0225",
      "N/A",
      "S21012",
      "SC-13-04",
      "SC-13-04/PO2019-0075&PO2019-077/2020-0116",
      "TO 53444-15",
      "TO 52492-15",
      "TO 53940-08",
      "TO 55543-28",
      "TO 56511-28",
      "TO 57551-10",
      "TO 57552-16",
      "TO  57553-21",
      "TO 57554-30",
      "TO 57555-34",
      "TO 57556-35",
      "TO 57557-36",
      "TO 57564-08",
      "TO 57789-15",
    ];
    subcontract_numbers.forEach(async function (e) {
      const [contractNameCustomer, cccreated] = await db.SubcontractNumber.findOrCreate({
        where: { name: e },
      });

      if (cccreated) {
        console.log("contract Customer created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract Customer", e);
      }
    });

    console.log("Adding Contract primes");
    var contract_primes = [
      "3M",
      "American Systems Cooperation",
      "AstraFine JV LLC",
      "Cerner Government Services, inc.",
      "Diverse Systems Group, LLC",
      "Favor TechConsulting, LLC",
      "Innovative Information Solutions, LLC",
      "ManTech Advance Systems International, inc.",
      "MicroHealth, LLC",
      "Planned Systems International inc.",
      "Verizon Federal Services, inc.",
    ];
    contract_primes.forEach(async function (e) {
      const [contractPrime, cpcreated] = await db.ContractPrime.findOrCreate({
        where: { name: e },
      });

      if (cpcreated) {
        console.log("ContractPrimecreated successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating ContractPrime", e);
      }
    });

    console.log("Adding Contract current pops");
    var contract_current_pops = [
      "Base Period",
      "Base Period 2",
      "Contract Yr 3",
      "Option Period 1",
      "Option Period 2",
      "Option Period 3",
      "Option Period 4",
      "Option Year 1",
    ];
    contract_current_pops.forEach(async function (e) {
      const [contractNameCustomer, cccreated] = await db.ContractCurrentPop.findOrCreate({
        where: { name: e },
        defaults: { user_id: user.id },
      });

      if (cccreated) {
        console.log("contractContractCurrentPop successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating ContractCurrentPop", e);
      }
    });

    console.log("Adding Contract classification");
    var contract_classification = ["FFP", "T&M", "Labor Hour", "FFP for support services/ T&M for travel", "FFP/ T&M", "FFP/ FFPU"];
    contract_classification.forEach(async function (e) {
      const [contractClassification, cccreated] = await db.ContractClassification.findOrCreate({
        where: { name: e },
      });

      if (cccreated) {
        console.log("ContractClassification created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating ContractClassification", e);
      }
    });

    console.log("Adding Contract categories");
    var contract_categories = ["Commercial", "Fedaral"];
    contract_categories.forEach(async function (e) {
      const [contractCategory, cccreated] = await db.ContractCategory.findOrCreate({
        where: { name: e },
      });

      if (cccreated) {
        console.log("contract Customer created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract Customer", e);
      }
    });

    console.log("Adding Contract client type");
    var contract_client_types = ["Government", "Client"];
    contract_client_types.forEach(async function (e) {
      const [contractClientType, cccreated] = await db.ContractClientType.findOrCreate({
        where: { name: e },
      });

      if (cccreated) {
        console.log("contract Customer created successfully", e); // This will certainly be 'Technical Lead JavaScript'
      } else {
        console.log("Error creating contract Customer", e);
      }
    });

    // console.log("Adding default system roles")
    // var roles = [
    //   {
    //     role_type: "update-project",
    //     type_of: 'project',
    //     role_privileges: RolePrivilege::PROJECT_PRIVILEGES_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "RWD",role_type: role_privilege} }
    //   },
    //   {
    //     role_type: "read-project",
    //     type_of: 'project',
    //     role_privileges: RolePrivilege::PROJECT_PRIVILEGES_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "R",role_type: role_privilege} }
    //   },
    //   {
    //     role_type: "contribute-project",
    //     type_of: 'project',
    //     role_privileges: RolePrivilege::PROJECT_PRIVILEGES_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "RW",role_type: role_privilege} }
    //   },

    //   {
    //     role_type: "update-contract",
    //     type_of: 'contract',
    //     role_privileges: RolePrivilege::CONTRACT_PRIVILEGES_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "RWD",role_type: role_privilege} }
    //   },
    //   {
    //     role_type: "read-contract",
    //     type_of: 'contract',
    //     role_privileges: RolePrivilege::CONTRACT_PRIVILEGES_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "R",role_type: role_privilege} }
    //   },
    //   {
    //     role_type: "contribute-contract",
    //     type_of: 'contract',
    //     role_privileges: RolePrivilege::CONTRACT_PRIVILEGES_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "RW",role_type: role_privilege} }
    //   },

    //   {
    //     role_type: "program-admin",
    //     type_of: 'admin',
    //     role_privileges: RolePrivilege::PROGRAM_SETTINGS_ROLE_TYPES.map{ |role_privilege| {name: role_privilege, privilege: "RWD",role_type: role_privilege} }
    //   },
    //   {
    //     role_type: "program-admin-not-users",
    //     type_of: 'admin',
    //     role_privileges: (RolePrivilege::PROGRAM_SETTINGS_ROLE_TYPES - ["program_setting_users_roles"]).map{ |role_privilege| {name: role_privilege, privilege: "RWD",role_type: role_privilege} }
    //   },
    //   {
    //     role_type: "program-admin-not-contract",
    //     type_of: 'admin',
    //     role_privileges: ( RolePrivilege::PROGRAM_SETTINGS_ROLE_TYPES - ["program_setting_contracts"]).map{ |role_privilege| {name: role_privilege, privilege: "RWD",role_type: role_privilege} }
    //   },
    // ]

    // roles.forEach(function(e){
    //   const [role, rcreated] = await db.Role.findOrCreate({
    //     where: { name: e["role_type"] },
    //     defaults: {user_id: user.id}
    //   })

    //   if (rcreated) {
    //     console.log("rcreated created successfully", e); // This will certainly be 'Technical Lead JavaScript'
    //   }else{
    //     console.log("Error creating rcreated", e);
    //   }
    // })

    // await queryInterface.bulkInsert('projects', [
    //   {
    //     name: 'Project1',
    //     description: "Project1 description",
    //     created_at: new Date(),
    //     updated_at: new Date()
    //   },
    //   {
    //     name: 'Project2',
    //     description: "Project2 description",
    //     created_at: new Date(),
    //     updated_at: new Date()
    //   },
    //   {
    //     name: 'Project3',
    //     description: "Project3 description",
    //     created_at: new Date(),
    //     updated_at: new Date()
    //   }
    // ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
