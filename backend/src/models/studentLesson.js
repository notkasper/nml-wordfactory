module.exports = (sequelize) =>
  sequelize.define(
    'student_lesson',
    {},
    {
      freezeTableName: true,
      underscored: true,
    }
  );
