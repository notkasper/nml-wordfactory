const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  await query.addColumn('QuestionGroupAttempts', 'classId', {
    type: DataTypes.UUID,
    allowNull: false,
  });

  await query.addColumn('QuestionGroupAttempts', 'lessonId', {
    type: DataTypes.UUID,
    allowNull: false,
  });

  await query.addColumn('QuestionGroupAttempts', 'studentId', {
    type: DataTypes.UUID,
    allowNull: false,
  });

  await query.addColumn('QuestionAttempts', 'classId', {
    type: DataTypes.UUID,
    allowNull: false,
  });

  await query.addColumn('QuestionAttempts', 'lessonId', {
    type: DataTypes.UUID,
    allowNull: false,
  });

  await query.addColumn('QuestionAttempts', 'studentId', {
    type: DataTypes.UUID,
    allowNull: false,
  });
};

const down = async (query) => {
  await query.removeColumn('QuestionGroupAttempts', 'classId');
  await query.removeColumn('QuestionGroupAttempts', 'lessonId');
  await query.removeColumn('QuestionGroupAttempts', 'studentId');
  await query.removeColumn('QuestionAttempts', 'classId');
  await query.removeColumn('QuestionAttempts', 'lessonId');
  await query.removeColumn('QuestionAttempts', 'studentId');
};

module.exports = { up, down };
