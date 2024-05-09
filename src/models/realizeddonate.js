'use strict';
const { Model, DataTypes } = require('sequelize');

class RealizedDonate extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      item_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
    }, {
      sequelize,
      modelName: 'RealizedDonate',
      tableName: 'realizeddonates',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {},
    })
  }; 

  static associate(models) {
    this.belongsTo(models.Donate, { foreignKey: 'item_id', as: 'donate' });
    this.hasOne(models.User, { foreignKey: 'id', as: 'user' });
  }

}
module.exports = RealizedDonate;