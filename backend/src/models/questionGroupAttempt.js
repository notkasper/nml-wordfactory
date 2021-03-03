const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('QuestionGroupAttempt', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    timeElapsedSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correct: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    incorrect: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    missed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    showFeedback: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
