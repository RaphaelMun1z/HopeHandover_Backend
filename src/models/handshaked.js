'use strict';
const { Model, DataTypes } = require('sequelize');

class HandShaked extends Model {
  static init(sequelize) {
    super.init({
      hand_shake_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      donor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
      modelName: 'HandShaked',
      tableName: 'HandShakeds',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {},
    })
  };

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}
module.exports = HandShaked;