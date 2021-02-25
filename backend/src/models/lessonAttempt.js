const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define(
    'lesson_attempt',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      stopped_time: {
        type: DataTypes.DATE,
      },
      started_time: {
        type: DataTypes.DATE,
      },
      is_stopped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_started: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { underscored: true, freezeTableName: true }
  );
