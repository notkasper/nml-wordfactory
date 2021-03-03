const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('QuestionAttempt', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    // For a description of the content, see: https://drive.google.com/drive/folders/1qd-xRHG27KmAmLOA47oETB5HDJ7UFTeL
    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
