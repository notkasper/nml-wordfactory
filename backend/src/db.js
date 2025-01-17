const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

/* ADD MODELS HERE */
const Class = require('./models/class');
const Course = require('./models/course');
const Lesson = require('./models/lesson');
const LessonAttempt = require('./models/lessonAttempt');
const Question = require('./models/question');
const QuestionAttempt = require('./models/questionAttempt');
const QuestionGroup = require('./models/questionGroup');
const QuestionGroupAttempt = require('./models/questionGroupAttempt');
const Student = require('./models/student');
const StudentClass = require('./models/studentClass');
const Teacher = require('./models/teacher');
const TeacherClass = require('./models/teacherClass');

const logger = require('./logger');

const db = {};

// models and relationships can be found at this url: https://drawsql.app/radboud-university/diagrams/wordfactory-teacher-dashboard
db.setupModels = async () => {
  try {
    // models
    db.Class = Class(db.sequelize);
    db.Course = Course(db.sequelize);
    db.Lesson = Lesson(db.sequelize);
    db.LessonAttempt = LessonAttempt(db.sequelize);
    db.Question = Question(db.sequelize);
    db.QuestionAttempt = QuestionAttempt(db.sequelize);
    db.QuestionGroup = QuestionGroup(db.sequelize);
    db.QuestionGroupAttempt = QuestionGroupAttempt(db.sequelize);
    db.Student = Student(db.sequelize);
    db.StudentClass = StudentClass(db.sequelize);
    db.Teacher = Teacher(db.sequelize);
    db.TeacherClass = TeacherClass(db.sequelize);

    // Teacher relationships
    db.Teacher.belongsToMany(db.Class, {
      foreignKey: 'teacherId',
      otherKey: 'classId',
      through: db.TeacherClass,
      as: 'classes',
    });

    // Class relationships
    db.Class.belongsToMany(db.Teacher, {
      foreignKey: 'classId',
      otherKey: 'teacherId',
      through: db.TeacherClass,
      as: 'teachers',
    });

    db.Class.belongsToMany(db.Student, {
      foreignKey: 'classId',
      otherKey: 'studentId',
      through: db.StudentClass,
      as: 'students',
    });

    db.Class.hasMany(db.Course, {
      foreignKey: 'classId',
      as: 'courses',
    });

    db.Class.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'classId',
      as: 'questionGroupAttempts',
    });

    db.Class.hasMany(db.QuestionAttempt, {
      foreignKey: 'classId',
      as: 'questionAttempts',
    });

    // Student relationships
    db.Student.belongsToMany(db.Class, {
      foreignKey: 'studentId',
      otherKey: 'classId',
      through: db.StudentClass,
      as: 'classes',
    });

    db.Student.hasMany(db.LessonAttempt, {
      foreignKey: 'studentId',
      as: 'lessonAttempts',
    });

    db.Student.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'studentId',
      as: 'questionGroupAttempts',
    });

    db.Student.hasMany(db.QuestionAttempt, {
      foreignKey: 'studentId',
      as: 'questionAttempts',
    });

    // Course relationships
    db.Course.hasMany(db.Lesson, {
      foreignKey: 'courseId',
      as: 'lessons',
    });

    db.Course.belongsTo(db.Class, {
      foreignKey: 'classId',
      as: 'class',
    });

    // Lesson relationships
    db.Lesson.hasMany(db.QuestionGroup, {
      foreignKey: 'lessonId',
      as: 'questionGroups',
    });

    db.Lesson.hasMany(db.LessonAttempt, {
      foreignKey: 'lessonId',
      as: 'lessonAttempts',
    });

    db.Lesson.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'lessonId',
      as: 'questionGroupAttempts',
    });

    db.Lesson.hasMany(db.QuestionAttempt, {
      foreignKey: 'lessonId',
      as: 'questionAttempts',
    });

    db.Lesson.belongsTo(db.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });

    // QuestionGroup relationships
    db.QuestionGroup.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });

    db.QuestionGroup.hasMany(db.Question, {
      foreignKey: 'questionGroupId',
      as: 'questions',
    });

    db.QuestionGroup.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'questionGroupId',
      as: 'questionGroupAttempts',
    });

    // Question relationships
    db.Question.belongsTo(db.QuestionGroup, {
      foreignKey: 'questionGroupId',
      as: 'questionGroup',
    });

    db.Question.hasMany(db.QuestionAttempt, {
      foreignKey: 'questionId',
      as: 'questionAttempts',
    });

    // LessonAttempt relationships
    db.LessonAttempt.belongsTo(db.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });

    db.LessonAttempt.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });

    db.LessonAttempt.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'lessonAttemptId',
      as: 'questionGroupAttempts',
    });

    // QuestionGroupAttempt relationships
    db.QuestionGroupAttempt.belongsTo(db.LessonAttempt, {
      foreignKey: 'lessonAttemptId',
      as: 'lessonAttempt',
    });

    db.QuestionGroupAttempt.belongsTo(db.QuestionGroup, {
      foreignKey: 'questionGroupId',
      as: 'questionGroup',
    });

    db.QuestionGroupAttempt.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });

    db.QuestionGroupAttempt.belongsTo(db.Class, {
      foreignKey: 'classId',
      as: 'class',
    });

    db.QuestionGroupAttempt.hasMany(db.QuestionAttempt, {
      foreignKey: 'questionGroupAttemptId',
      as: 'questionAttempts',
    });

    // QuestionAttempt relationships
    db.QuestionAttempt.belongsTo(db.QuestionGroupAttempt, {
      foreignKey: 'questionGroupAttemptId',
      as: 'questionGroupAttempt',
    });

    db.QuestionAttempt.belongsTo(db.Question, {
      foreignKey: 'questionId',
      as: 'question',
    });

    db.QuestionAttempt.belongsTo(db.Class, {
      foreignKey: 'classId',
      as: 'class',
    });

    db.QuestionAttempt.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });

    logger.info('All models created successfully');
  } catch (error) {
    logger.error('Error setting up models');
    throw error;
  }
};

db.connect = async () => {
  try {
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        logging: false,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT,
        dialect: 'postgres',
      }
    );
    await sequelize.authenticate();
    db.sequelize = sequelize;
    logger.info('Connected to database successfully');
    return sequelize;
  } catch (error) {
    logger.error('Error connecting to database');
    throw error;
  }
};

db.migrate = async () => {
  try {
    const umzug = new Umzug({
      migrations: {
        // indicates the folder containing the migration .js files
        path: path.join(__dirname, './migrations'),
        // inject sequelize's QueryInterface in the migrations
        params: [db.sequelize.getQueryInterface()],
      },
      // indicates that the migration data should be store in the database
      // itself through sequelize. The default configuration creates a table
      // named `SequelizeMeta`.
      storage: 'sequelize',
      storageOptions: {
        sequelize: db.sequelize,
      },
    });

    await umzug.up();
    logger.info('All migrations performed successfully');
    db.umzug = umzug;
    return umzug;
  } catch (error) {
    logger.error('Error migrating database');
    throw error;
  }
};

db.initialize = async () => {
  await db.connect();
  await db.migrate();
  await db.setupModels();
};

db.close = () => {
  db.sequelize.close();
};

module.exports = db;
