const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define(
    'lesson',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_prefix: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lesson_instruction: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lesson_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true, freezeTableName: true }
  );
