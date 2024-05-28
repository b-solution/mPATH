"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // // this.belongsTo(models.Noteable);
      this.belongsTo(models.User);
      this.belongsTo(models.Issue, { foreignKey: "noteable_id", constraints: false });
      this.belongsTo(models.Task, { foreignKey: "noteable_id", constraints: false });

      // // this.hasMany(models.NoteFile)
    }
    async toJSON() {
      const { db } = require("./index.js");

      let _resource = this.get({ plain: true });
      let user = await this.getUser();
      _resource["attachFiles"] = [];
      if (user) {
        _resource["user"] = { id: user.id, full_name: user.getFullName() };
      } else {
        _resource["user"] = {};
      }

      return _resource;
    }
  }
  Note.init(
    {
      noteable_type: DataTypes.STRING,
      noteable_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "notes",
      modelName: "Note",
      underscored: true,
    }
  );
  return Note;
};
