const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const fastify = require("fastify")({
  logger: true,
});

//To add middlewares
fastify.register(require("@fastify/middie"));

const qs = require("qs");

const cors = require("@fastify/cors");
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoute");
const usersRoute = require("./routes/usersRoutes");
const programsRoute = require("./routes/programsRoutes");
const lessonsRoutes = require("./routes/lessonsRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const issuesRoutes = require("./routes/issuesRoutes");
const effortsRoutes = require("./routes/effortsRoutes");
const risksRoutes = require("./routes/risksRoutes");
const notesRoutes = require("./routes/notesRoutes");
const rolesRoutes = require("./routes/rolesRoutes");
const filterDataRoutes = require("./routes/filterDataRoutes");
const queryRouters = require("./routes/queryRouters");
const downloadResourceFileRoutes = require("./routes/downloadResourceFileRoutes");

const programSettingContractDataRoutes = require("./routes/programSettingContractDataRoutes");
const programSettingContractsRoutes = require("./routes/programSettingContractsRoutes");
const programSettingContractVehiclesRoutes = require("./routes/programSettingContractVehiclesRoutes");
const programSettingFacilitiesRoutes = require("./routes/programSettingFacilitiesRoutes");
const programSettingFacilityGroupsRoutes = require("./routes/programSettingFacilityGroupsRoutes");
const programSettingProjectsRoutes = require("./routes/programSettingProjectsRoutes");
const programSettingRolesRoutes = require("./routes/programSettingRolesRoutes");
const programSettingUsersRoutes = require("./routes/programSettingUsersRoutes");

const portfolioContractDataRoutes = require("./routes/portfolioContractDataRoutes");
const portfolioContractVehicleRoutes = require("./routes/portfolioContractVehicleRoutes");
const taskStagesRoutes = require("./routes/taskStagesRoutes");
const taskTypeRoutes = require("./routes/taskTypeRoutes");
const settingRoutes = require("./routes/settingRoutes");
const projectContractRoutes = require("./routes/projectContractRoutes");
const issueSeveritiesRoutes = require("./routes/issueSeveritiesRoutes");
const issueStageRoutes = require("./routes/issueStageRoutes");
const issueTypeRoutes = require("./routes/issueTypeRoutes");
const facilitiesRoutes = require("./routes/facilitiesRoutes");
const facilityGroupRoutes = require("./routes/facilityGroupsRoutes");
const sortRoutes = require("./routes/sortRoutes");
const statusRoutes = require("./routes/statusesRoutes");
const facilityProjectRoutes = require("./routes/facilityProjectRoutes");
// fastify.addHook('onRequest', function(request, reply, done) {
// 	let body = qs.parse(request.body)
// 	let query = qs.parse(request.query)
// 	let params = qs.parse(request.params)

//   console.log('*****body', body);
//   console.log('****query', query);
//   console.log('****params', params);

//   done();
// })
// const formDataParser = require("body-parser");

const { db } = require("./database/models"); // import models
const { matchPath } = require("react-router");
const PORT = 3000;

fastify.register(cors, {
  // put your options here
});
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "..", "uploads"),
  prefix: "/public/",
  // constraints: { host: 'example.com' } // optional: default {}
});
// fastify.register(require('@fastify/multipart'), {addToBody: true})
// fastify.register(require('@fastify/formbody'))
// fastify.register(formDataParser);
fastify.register(authRoute);
fastify.register(profileRoute);
fastify.register(usersRoute);
fastify.register(programsRoute);
fastify.register(lessonsRoutes);
fastify.register(tasksRoutes);
fastify.register(issuesRoutes);
fastify.register(effortsRoutes);
fastify.register(risksRoutes);
fastify.register(rolesRoutes);
fastify.register(notesRoutes);
fastify.register(filterDataRoutes);
fastify.register(queryRouters);
fastify.register(downloadResourceFileRoutes);

// fastify.register(programSettingContractDataRoutes)
fastify.register(programSettingContractsRoutes);
fastify.register(programSettingContractVehiclesRoutes);
fastify.register(programSettingFacilitiesRoutes);
fastify.register(programSettingFacilityGroupsRoutes);
fastify.register(programSettingProjectsRoutes);
fastify.register(programSettingUsersRoutes);
fastify.register(programSettingRolesRoutes);

fastify.register(portfolioContractDataRoutes);
fastify.register(portfolioContractVehicleRoutes);
fastify.register(taskStagesRoutes);
fastify.register(taskTypeRoutes);
fastify.register(settingRoutes);
fastify.register(projectContractRoutes);
fastify.register(issueSeveritiesRoutes);
fastify.register(issueStageRoutes);
fastify.register(issueTypeRoutes);
fastify.register(facilitiesRoutes);
fastify.register(facilityGroupRoutes);
fastify.register(sortRoutes);
fastify.register(statusRoutes);
fastify.register(facilityProjectRoutes);

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await db.sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  const [AdminJsModule, AdminJsFastify, AdminJSSequelize] = await Promise.all([
    import("adminjs"),
    import("@adminjs/fastify"),
    import("@adminjs/sequelize"),
  ]);
  AdminJsModule.AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
  });

  const adminJsInstance = new AdminJsModule.AdminJS({
    resources: [
      {
        resource: db.Status,
        options: {
          navigation: {
            name: "Facilities Related",
          },
        },
      },
      {
        resource: db.FacilityGroup,
        options: {
          navigation: {
            name: "Facilities Related",
          },
        },
      },
      {
        resource: db.Organization,
        options: {
          navigation: {
            name: "Users Related",
          },
        },
      },
      {
        resource: db.User,
        options: {
          navigation: {
            name: "Users Related",
          },
        },
      },
      {
        resource: db.Issue,
        options: {
          navigation: {
            name: "Issues Related",
          },
          actions: {
            myCustomAction: {
              actionType: "resource",
              component: false,
              handler: (request, response, context) => {
                console.log("res----", response);
                const { record, currentAdmin } = context;
                return {
                  record: record.toJSON(currentAdmin),
                  msg: "Hello world",
                };
              },
            },
          },
        },
      },
      {
        resource: db.IssueType,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.IssueSeverity,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.IssueStage,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.Lesson,
        options: {
          navigation: {
            name: "Lessons Related",
          },
        },
      },
      {
        resource: db.LessonDetail,
        options: {
          navigation: {
            name: "Lessons Related",
          },
        },
      },
      {
        resource: db.LessonStage,
        options: {
          navigation: {
            name: "Lessons Related",
            icon: "Lesoon",
          },
        },
      },
      {
        resource: db.Effort,
        options: {
          navigation: {
            name: "Efforts Related",
          },
        },
      },
      {
        resource: db.Task,
        options: {
          navigation: {
            name: "Tasks Related",
          },
        },
      },
      {
        resource: db.TaskStage,
        options: {
          navigation: {
            name: "Tasks Related",
          },
        },
      },
      {
        resource: db.Project,
        options: {
          navigation: {
            name: "Projects Related",
          },
        },
      },
      {
        resource: db.ProjectType,
        options: {
          navigation: {
            name: "Projects Related",
          },
        },
      },
      db.ProjectContractVehicle,
      db.Contract,
      db.ProjectContract,
      db.TaskType,
      // db.ProjectContractVehicle,
    ],
    rootPath: "/admin",
  });
  await AdminJsFastify.buildRouter(adminJsInstance, fastify);
  fastify.listen({ port: PORT }, (err, address) => {
    if (err) throw err;
    console.log(`Sequelize + Express server started on port ${PORT}`);
  });
}

init();
