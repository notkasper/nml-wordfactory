const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('Answer', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.JSON,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    showFeedback: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    correct: {
      type: DataTypes.INTEGER,
    },
    incorrect: {
      type: DataTypes.INTEGER,
    },
    missed: {
      type: DataTypes.INTEGER,
    },
    timeElapsedSeconds: {
      type: DataTypes.INTEGER,
    },
  });
