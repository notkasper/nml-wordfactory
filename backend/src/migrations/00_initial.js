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

  // lessonAttempt table
  await query.createTable(
    'lesson_attempts',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      student_id: {
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

  // answers table
  await query.createTable(
    'answers',
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

  // teacher student join table
  await query.createTable(
    'teacher_student',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      student_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.UUID,
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

  // teacher lesson join table
  await query.createTable(
    'teacher_lesson',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.UUID,
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

  // student lesson join table
  await query.createTable(
    'student_lesson',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      lesson_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.UUID,
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
  // regular tables
  await query.dropTable('teachers');
  await query.dropTable('students');
  await query.dropTable('lessons');
  await query.dropTable('questions');
  await query.dropTable('lesson_attempts');
  await query.dropTable('answers');

  // join tables
  await query.dropTable('teacher_student');
  await query.dropTable('teacher_lesson');
  await query.dropTable('student_lesson');
};

module.exports = { up, down };
