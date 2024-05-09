'use strict';
const { Model, DataTypes } = require('sequelize');

class QuestionContact extends Model {
  static init(sequelize) {
    super.init({
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING
      },
      question: {
        allowNull: false,
        type: DataTypes.STRING
      },
    }, {
      sequelize,
      modelName: 'QuestionContact',
      tableName: 'questioncontacts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {},
    })
  };

  static associate(models) {

  }
}

module.exports = QuestionContact;