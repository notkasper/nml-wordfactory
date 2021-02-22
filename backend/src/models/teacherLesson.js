module.exports = (sequelize) =>
  sequelize.define(
    'teacher_lesson',
    {},
    {
      freezeTableName: true,
      underscored: true,
    }
  );
