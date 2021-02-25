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
    passwordEncrypted: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(['teacher', 'student']),
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
    lessonPrefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonInstruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lessonTitle: {
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
    lessonId: {
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
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    stoppedTime: {
      type: DataTypes.DATE,
    },
    startedTime: {
      type: DataTypes.DATE,
    },
    isStopped: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isStarted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isCompleted: {
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
    lessonAttemptId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    showFeedback: {
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
    timeElapsedSeconds: {
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
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teacherId: {
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
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
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
  await query.dropTable('Users');
  await query.dropTable('Lessons');
  await query.dropTable('Questions');
  await query.dropTable('LessonAttempts');
  await query.dropTable('Answers');

  // join tables
  await query.dropTable('TeacherStudents');
  await query.dropTable('UserLessons');
};

module.exports = { up, down };
