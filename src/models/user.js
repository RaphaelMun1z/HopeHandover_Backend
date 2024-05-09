'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { associate } = require('./address');

class User extends Model {
    static init(sequelize) {
        super.init({
            firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false
            },
            usertype: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            accesslevel: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            islogged: {
                type: DataTypes.BOOLEAN
            }
        }, {
            sequelize,
            hooks: {
                beforeValidate: (user) => {
                    if (user.changed('password')) {
                        const salt = bcrypt.genSaltSync()
                        user.password = bcrypt.hashSync(user.password, salt)
                    }
                },
            }
        })
    }

    static associate(models) {
        this.hasMany(models.Address, { foreignKey: 'user_id', as: 'address' });
        this.hasMany(models.Project, { foreignKey: 'ownid', as: 'project' });
        this.hasMany(models.SavedProject, { foreignKey: 'userid', as: 'savedproject' });
        this.hasMany(models.HandShaked, { foreignKey: 'user_id', as: 'handshaked' });
        this.belongsTo(models.RealizedDonate, { foreignKey: 'id', as: 'realizeddonate' });
    }

}

module.exports = User;
