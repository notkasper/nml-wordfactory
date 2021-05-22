const { Sequelize } = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const up = async (query) => {
  // teacher table
  await query.createTable('Teachers', {
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

  await query.createTable('Students', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
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

  await query.createTable('Classes', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
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

  // TeacherClass join table
  await query.createTable('TeacherClasses', {
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classId: {
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

  // StudentClass join table
  await query.createTable('StudentClasses', {
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classId: {
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

  // Course table
  await query.createTable('Courses', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
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
    courseId: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
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
    name: {
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
    questionGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
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
    studentId: {
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
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
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
  await query.createTable('QuestionAttempts', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionGroupAttemptId: {
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
};

const down = async (query) => {
  // regular tables
  await query.dropTable('Teachers');
  await query.dropTable('Students');
  await query.dropTable('Classes');
  await query.dropTable('Courses');
  await query.dropTable('Lessons');
  await query.dropTable('LessonAttempts');
  await query.dropTable('QuestionGroups');
  await query.dropTable('QuestionGroupAttempts');
  await query.dropTable('Questions');
  await query.dropTable('QuestionAttempts');

  // join tables
  await query.dropTable('StudentClasses');
  await query.dropTable('TeacherClasses');
};

module.exports = { up, down };
