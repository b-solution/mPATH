const { comparePassword, cryptPassword } = require("./helpers");

async function setAdminPanel(db, fastify) {
  const [AdminJsModule, AdminJsFastify, AdminJSSequelize, path, passwordsFeature] = await Promise.all([
    import("adminjs"),
    import("@adminjs/fastify"),
    import("@adminjs/sequelize"),
    import("path"),
    import("@adminjs/passwords").then((module) => module.default),
  ]);

  const validateForm = async (request, context) => {
    const password = request.body.password.value;
    const hashedPassword = await cryptPassword(password);
    request.payload.encrypted_password = hashedPassword;
    return request;
  };

  const authenticate = async ({ email, password }, ctx) => {
    const user_db = await db.User.findOne({ where: { email } });
    console.log(user_db);
    if (!user_db) {
      return null;
    } else {
      if (user_db.role === 1) {
        const passwordMatch = await comparePassword(password, user_db.encrypted_password);
        if (!passwordMatch) {
          return null;
        } else {
          return { email };
        }
      }
    }
  };
  const bcryptHash = (password) => {
    const saltRounds = 10;
    return bcrypt.genSalt(saltRounds).then((salt) => bcrypt.hash(password, salt));
  };
  const dirname = path.dirname(__filename);
  const componentLoader = new AdminJsModule.ComponentLoader();
  const authProvider = new AdminJsModule.DefaultAuthProvider({
    componentLoader,
    authenticate,
  });
  const override = (url, componentName) => componentLoader.override(componentName, path.join(dirname, url));
  override("../top-bar", "Version");
  AdminJsModule.AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
  });
  const adminJsInstance = new AdminJsModule.AdminJS({
    resources: [
      {
        resource: db.Facility,
        options: {
          navigation: {
            name: "Facilities Related",
          },
        },
      },
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
          editProperties: [
            "id",
            "email",
            "title",
            "first_name",
            "last_name",
            "phone_number",
            "address",
            "role",
            "country_code",
            "status",
            "lat",
            "lan",
            "organization_id",
          ],
          properties: { password: { isVisible: false } },
          actions: {
            new: {
              before: [validateForm],
            },
          },
        },
        features: [
          passwordsFeature({
            componentLoader,
            properties: {
              password: "newPassword",
              encrypted_password: "password",
            },
            hash: bcryptHash,
          }),
        ],
      },
      {
        resource: db.Issue,
        navigation: {
          name: "Issues Related",
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
      {
        resource: db.Risk,
        options: {
          navigation: {
            name: "Risk Related",
          },
        },
      },
      {
        resource: db.RiskStage,
        options: {
          navigation: {
            name: "Risk Related",
          },
        },
      },
      {
        resource: db.ProjectContractVehicle,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.ProjectContract,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.ProjectContractVehicle,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.Contract,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
      {
        resource: db.TaskType,
        options: {
          navigation: {
            name: "Issues Related",
          },
        },
      },
    ],
    componentLoader,
    env: {
      REACT_APP_CUSTOM_VARIABLE: process.env.REACT_APP_CLIENT_URL,
    },
    rootPath: "/admin",
  });
  adminJsInstance.watch();
  const cookieSecret = "sieL67H7GbkzJ4XCoH0IHcmO1hGBSiG5";
  await AdminJsFastify.buildAuthenticatedRouter(
    adminJsInstance,
    {
      cookiePassword: "test",
      provider: authProvider,
    },
    fastify,
    {
      secret: cookieSecret,
      resave: false,
      saveUninitialized: true,
    }
  );
}
module.exports = setAdminPanel;
