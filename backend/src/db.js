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
      as: 'classes',
      through: db.TeacherClass,
      foreignKey: 'teacherId',
      otherKey: 'classId',
    });

    // Class relationships
    db.Class.belongsToMany(db.Teacher, {
      as: 'teachers',
      through: db.TeacherClass,
      foreignKey: 'classId',
      otherKey: 'teacherId',
    });

    db.Class.belongsToMany(db.Student, {
      as: 'students',
      through: db.StudentClass,
      foreignKey: 'classId',
      otherKey: 'studentId',
    });

    db.Class.hasMany(db.Course, {
      foreignKey: 'classId',
    });

    // Student relationships
    db.Student.belongsToMany(db.Class, {
      as: 'classes',
      through: db.StudentClass,
      foreignKey: 'studentId',
      otherKey: 'classId',
    });

    // Course relationships
    db.Course.hasMany(db.Lesson, {
      foreignKey: 'courseId',
      as: 'lessons',
    });

    db.Course.belongsTo(db.Class, {
      foreignKey: 'classId',
    });

    // Lesson relationships
    db.Lesson.hasMany(db.QuestionGroup, {
      foreignKey: 'lessonId',
    });

    db.Lesson.hasMany(db.LessonAttempt, {
      foreignKey: 'lessonId',
    });

    db.Lesson.belongsTo(db.Course, {
      foreignKey: 'courseId',
    });

    // QuestionGroup relationships
    db.QuestionGroup.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
    });

    db.QuestionGroup.hasMany(db.Question, {
      foreignKey: 'questionGroupId',
    });

    db.QuestionGroup.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'questionGroupId',
    });

    // Question relationships
    db.Question.belongsTo(db.QuestionGroup, {
      foreignKey: 'questionGroupId',
    });

    // LessonAttempt relationships
    db.LessonAttempt.belongsTo(db.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });

    db.LessonAttempt.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
    });

    db.LessonAttempt.hasMany(db.QuestionGroupAttempt, {
      foreignKey: 'lessonAttemptId',
      as: 'questionGroupAttempts',
    });

    // QuestionGroupAttempt relationships
    db.QuestionGroupAttempt.belongsTo(db.LessonAttempt, {
      foreignKey: 'lessonAttemptId',
    });

    db.QuestionGroupAttempt.belongsTo(db.QuestionGroup, {
      foreignKey: 'questionGroupId',
    });

    db.QuestionGroupAttempt.hasMany(db.QuestionAttempt, {
      foreignKey: 'questionGroupAttemptId',
    });

    // QuestionAttempt relationships
    db.QuestionAttempt.belongsTo(db.QuestionGroupAttempt, {
      foreignKey: 'questionGroupAttemptId',
    });

    db.QuestionAttempt.belongsTo(db.Question, {
      foreignKey: 'questionId',
    });

    console.log('[DATABASE]: All models created successfully');
  } catch (error) {
    console.error('Error setting up models');
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
    console.log('[DATABASE]: Connected to database successfully');
    return sequelize;
  } catch (error) {
    console.error('Error connecting to database');
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
    console.log('[DATABASE]: All migrations performed successfully');
    db.umzug = umzug;
    return umzug;
  } catch (error) {
    console.error('Error migrating database');
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
