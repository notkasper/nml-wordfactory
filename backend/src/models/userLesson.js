module.exports = (sequelize) =>
  sequelize.define(
    'user_lesson',
    {},
    {
      freezeTableName: true,
      underscored: true,
    }
  );
