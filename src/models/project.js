'use strict';
const { Model, DataTypes } = require('sequelize');

class Project extends Model {
    static init(sequelize) {
        super.init({
            ownid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            contact: {
                type: DataTypes.STRING,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            event: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            address: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            image1: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image2: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image3: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            hooks: {

            }
        })
    };

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'ownid', as: 'user' });
        this.hasMany(models.SavedProject, { foreignKey: 'id', as: 'savedproject' });
        this.hasMany(models.Donate, { foreignKey: 'project_id', as: 'donate' });
        this.hasMany(models.ProjectMidia, { foreignKey: 'project_id', as: 'projectmidia' });
    }

}
module.exports = Project;