const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  // teacher table
  await query.createTable(
    'user',
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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // lesson table
  await query.createTable(
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // question table
  await query.createTable(
    'question',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // lessonAttempt table
  await query.createTable(
    'lesson_attempt',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stopped_time: {
        type: DataTypes.DATE,
      },
      started_time: {
        type: DataTypes.DATE,
      },
      is_stopped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_started: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // answers table
  await query.createTable(
    'answer',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_attempt_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.JSON,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      show_feedback: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      correct: {
        type: DataTypes.INTEGER,
      },
      incorrect: {
        type: DataTypes.INTEGER,
      },
      missed: {
        type: DataTypes.INTEGER,
      },
      time_elapsed_seconds: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // teacher student join table
  await query.createTable(
    'teacher_student',
    {
      student_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  // user lesson join table
  await query.createTable(
    'user_lesson',
    {
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true }
  );
};

const down = async (query) => {
  // regular tables
  await query.dropTable('teacher');
  await query.dropTable('student');
  await query.dropTable('lesson');
  await query.dropTable('question');
  await query.dropTable('lesson_attempt');
  await query.dropTable('answer');

  // join tables
  await query.dropTable('teacher_student');
  await query.dropTable('user_lesson');
};

module.exports = { up, down };
