const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  // teacher table
  await query.createTable(
    'teachers',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_encrypted: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // student table
  await query.createTable(
    'students',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_encrypted: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // lesson table
  await query.createTable(
    'lessons',
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // question table
  await query.createTable(
    'questions',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );
};

const down = async (query) => {
  await query.dropTable('teachers');
  await query.dropTable('students');
  await query.dropTable('lessons');
  await query.dropTable('questions');
};

module.exports = { up, down };
