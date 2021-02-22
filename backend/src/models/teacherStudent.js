module.exports = (sequelize) =>
  sequelize.define(
    'teacher_student',
    {},
    {
      freezeTableName: true,
      underscored: true,
    }
  );
