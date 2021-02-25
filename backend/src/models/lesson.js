const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('Lesson', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    lessonPrefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonInstruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lessonTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
