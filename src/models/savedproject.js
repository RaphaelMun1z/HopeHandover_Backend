'use strict';
const { Model, DataTypes } = require('sequelize');

class SavedProject extends Model {
  static init(sequelize) {
    super.init({
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
      modelName: 'SavedProject',
      tableName: 'savedprojects',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {},
    })
  };

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id', as: 'user' });
    this.belongsTo(models.Project, { foreignKey: 'projectid', as: 'project' });
  }
}
module.exports = SavedProject;