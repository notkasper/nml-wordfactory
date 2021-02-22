const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define(
    'answer',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      content: {
        type: DataTypes.JSON,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      show_feedback: {
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
      time_elapsed_seconds: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );
