const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('LessonAttempt', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    stoppedTime: {
      type: DataTypes.DATE,
    },
    startedTime: {
      type: DataTypes.DATE,
    },
    isStopped: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isStarted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
