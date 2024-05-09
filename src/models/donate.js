const { Model, DataTypes } = require('sequelize');

class Donate extends Model {
  static init(sequelize) {
    super.init({
      donate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    }, {
      sequelize,
      timestamps: true,
    })
  }

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    this.hasOne(models.RealizedDonate, { foreignKey: 'item_id', as: 'realizeddonate' });
  }
}

module.exports = Donate;