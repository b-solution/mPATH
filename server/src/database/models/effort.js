'use strict';
const {
  Op, Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Effort extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // // this.belongsTo(models.Resource);
      this.belongsTo(models.User);
      this.belongsTo(models.FacilityProject)

    }

    async updateProjected(options = {}) {
      let facilityProject = null;
      let effortIds = [];
    
      if (options.project_id && options.facility_id) {
        facilityProject = await db.FacilityProject.findOne({
          where: {
            project_id: options.project_id,
            facility_id: options.facility_id
          }
        });
      }
    
      if (facilityProject) {
        effortIds = await Effort.findAll({
          attributes: ['id'],
          where: {
            dateOfWeek: { [Op.lt]: new Date() },
            projected: true,
            facilityProjectId: facilityProject.id
          }
        }).map(effort => effort.id);
      } else {
        effortIds = await Effort.findAll({
          attributes: ['id'],
          where: {
            dateOfWeek: { [Op.lt]: new Date() },
            projected: true
          }
        }).map(effort => effort.id);
      }
    
      if (effortIds.length > 0) {
        await db.Effort.update({ projected: false }, { where: { id: effortIds } });
        const taskIds = await db.Effort.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('resource_id')), 'task_id']],
          where: { id: effortIds }
        }).map(effort => effort.task_id);
        await db.Task.updateActualEffort(taskIds);
      }
    }
    

    stripTrailingZero(n) {
      return n.toString().replace(/\.?0+$/, '');
    }
    
    formatDate(dateString) {
      const [year, month, day] = dateString.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${day} ${months[parseInt(month, 10) - 1]} ${year.slice(2)}`;
      return formattedDate;
    }

    thisWeekDates() {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Find the Monday of the current week
      const weekDates = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
      }
      return weekDates;
    }
    
    async toJSON(){
      const { db } = require("./index.js");
      
      let _resource = this.get({ plain: true });
      _resource.hours = parseInt(this.stripTrailingZero(this.hours) );
      _resource.date_of_week = this.date_of_week ? this.formatDate(this.date_of_week.toISOString().substring(0, 10)) : null;
      let user = await this.getUser()
      _resource['user'] = {id: user.id, full_name: user.getFullName()}
      return _resource
    }
  }
  Effort.init({
    date_of_week: DataTypes.DATE,
    hours: DataTypes.DECIMAL,
    user_id: DataTypes.INTEGER,
    resource_id: DataTypes.INTEGER,
    resource_type: DataTypes.STRING,
    facility_project_id: DataTypes.INTEGER,
    projected: DataTypes.BOOLEAN
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'efforts',
    modelName: 'Effort',
    underscored: true
  });
  return Effort;
};