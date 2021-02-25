const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define(
    'question',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true, freezeTableName: true }
  );
