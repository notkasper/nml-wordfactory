const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define('QuestionGroup', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
