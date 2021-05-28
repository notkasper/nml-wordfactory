const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('QuestionAttempt', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    // TODO: temporarily, correct / incorrect / missed / score are added to both group level and question level
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
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // For a description of the content, see: https://drive.google.com/drive/folders/1qd-xRHG27KmAmLOA47oETB5HDJ7UFTeL
    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
