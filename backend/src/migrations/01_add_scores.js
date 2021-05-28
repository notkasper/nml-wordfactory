const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  await query.addColumn('QuestionGroupAttempts', 'score', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await query.addColumn('QuestionAttempts', 'correct', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await query.addColumn('QuestionAttempts', 'incorrect', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await query.addColumn('QuestionAttempts', 'missed', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await query.addColumn('QuestionAttempts', 'score', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
};

const down = async (query) => {
  await query.removeColumn('QuestionGroupAttempts', 'score');
  await query.removeColumn('QuestionAttempts', 'correct');
  await query.removeColumn('QuestionAttempts', 'incorrect');
  await query.removeColumn('QuestionAttempts', 'missed');
  await query.removeColumn('QuestionAttempts', 'score');
};

module.exports = { up, down };
