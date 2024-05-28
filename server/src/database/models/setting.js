// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   class Setting extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Setting.init(
//     {
//       //var: DataTypes.TEXT,
//       value: DataTypes.TEXT,
//       target_type: DataTypes.TEXT,
//       target_id: DataTypes.TEXT,
//     },
//     {
//       sequelize,
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//       modelName: "Setting",
//       underscored: true,
//     }
//   );
//   return Setting;
// };
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Setting extends Model {
    static associate(models) {
      // define association here
    }
  }

  Setting.init(
    {
      google_map_key: DataTypes.TEXT, // Assuming 'google_map_key' is the actual column name in your database
      // Define other columns here based on your database schema
    },
    {
      sequelize,
      modelName: "Setting",
      underscored: true,
    }
  );

  return Setting;
};
