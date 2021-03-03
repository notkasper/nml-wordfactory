const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  // user table
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

  // LessonGroup table
  await query.createTable('LessonGroups', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    title: {
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

  // lesson table
  await query.createTable('Lessons', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    groupId: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
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

  // QuestionGroups table
  await query.createTable('QuestionGroups', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
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
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
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

  // QuestionGroupAttempts table
  await query.createTable('QuestionGroupAttempts', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    lessonAttemptId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timeElapsedSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correct: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    incorrect: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    missed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    showFeedback: {
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

  // QuestionAttemps table
  await query.createTable('QuestionAttemps', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    groupAttemptId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
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
  await query.createTable('UserLessonGroups', {
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
  await query.dropTable('QuestionGroups');
  await query.dropTable('QuestionGroupAttempts');

  // join tables
  await query.dropTable('TeacherStudents');
  await query.dropTable('UserLessonGroups');
};

module.exports = { up, down };
