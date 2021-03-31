const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('Lesson', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
