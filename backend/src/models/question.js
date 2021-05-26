const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('Question', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // For a description of the data, see: https://drive.google.com/drive/folders/1qd-xRHG27KmAmLOA47oETB5HDJ7UFTeL
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
