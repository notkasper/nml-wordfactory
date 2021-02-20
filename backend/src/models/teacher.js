const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = (sequelize) =>
  sequelize.define(
    'teacher',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: DataTypes.STRING,
      password_encrypted: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    { underscored: true }
  );
