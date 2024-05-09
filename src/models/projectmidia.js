'use strict';
const { Model, DataTypes } = require('sequelize');

class ProjectMidia extends Model {
  static init(sequelize) {
    super.init({
      description: {
        allowNull: false,
        type: DataTypes.STRING
      },
      image: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      project_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
    }, {
      sequelize,
      modelName: 'ProjectMidia',
      tableName: 'projectmidia',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {},
    })
  };

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
  }

}
module.exports = ProjectMidia;