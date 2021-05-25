const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  await query.addColumn('Questions', 'contentTags', {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  });
};

const down = async (query) => {
  await query.removeColumn('Questions', 'contentTags');
};

module.exports = { up, down };
