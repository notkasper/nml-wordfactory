const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  // teacher table
  await query.createTable('Users', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // lesson table
  await query.createTable('Lessons', {
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
  });

  // question table
  await query.createTable('Questions', {
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
  });

  // lessonAttempt table
  await query.createTable('LessonAttempts', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // answers table
  await query.createTable('Answers', {
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
  });

  // teacher student join table
  await query.createTable('TeacherStudents', {
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
  });

  // user lesson join table
  await query.createTable('UserLessons', {
    lesson_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
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
  });
};

const down = async (query) => {
  // regular tables
  await query.dropTable('Teachers');
  await query.dropTable('Students');
  await query.dropTable('Lessons');
  await query.dropTable('Questions');
  await query.dropTable('LessonAttempts');
  await query.dropTable('Answers');

  // join tables
  await query.dropTable('TeacherStudents');
  await query.dropTable('UserLessons');
};

module.exports = { up, down };
