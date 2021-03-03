const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

/* ADD MODELS HERE */
const Lesson = require('./models/lesson');
const LessonAttempt = require('./models/lessonAttempt');
const LessonGroup = require('./models/lessonGroup');
const Question = require('./models/question');
const QuestionAttempt = require('./models/questionAttempt');
const QuestionGroup = require('./models/questionGroup');
const questionGroupAttempt = require('./models/questionGroupAttempt');
const TeacherStudent = require('./models/teacherStudent');
const User = require('./models/user');
const UserLessonGroup = require('./models/UserLessonGroup');

const db = {};

// models and relationships can be found at this url: https://drawsql.app/radboud-university/diagrams/wordfactory-teacher-dashboard
db.setupModels = async () => {
  try {
    // models
    db.Lesson = Lesson(db.sequelize);
    db.LessonAttempt = LessonAttempt(db.sequelize);
    db.LessonGroup = LessonGroup(db.sequelize);
    db.Question = Question(db.sequelize);
    db.QuestionAttempt = QuestionAttempt(db.sequelize);
    db.QuestionGroup = QuestionGroup(db.sequelize);
    db.questionGroupAttempt = questionGroupAttempt(db.sequelize);
    db.User = User(db.sequelize);

    // join tables
    db.TeacherStudent = TeacherStudent(db.sequelize);
    db.UserLessonGroup = UserLessonGroup(db.sequelize);

    // User relationships
    db.User.belongsToMany(db.User, {
      as: 'Teachers',
      through: db.TeacherStudent,
      foreignKey: 'teacherId',
    });

    db.User.belongsToMany(db.User, {
      as: 'Students',
      through: db.TeacherStudent,
      foreignKey: 'studentId',
    });

    db.User.belongsToMany(db.LessonGroup, {
      as: 'LessonGroups',
      through: db.UserLessonGroup,
      foreignKey: 'userId',
    });

    db.User.hasMany(db.LessonAttempt, {
      foreignKey: 'userId',
    });

    // LessonGroup relationships
    db.LessonGroup.hasMany(db.Lesson, {
      foreignKey: 'groupId',
    });

    db.LessonGroup.belongsToMany(db.User, {
      as: 'LessonGroups',
      through: db.UserLessonGroup,
      foreignKey: 'lessonGroupId',
    });

    // Lesson relationships
    db.Lesson.hasMany(db.QuestionGroup, {
      foreignKey: 'lessonId',
    });

    db.Lesson.hasMany(db.LessonAttempt, {
      foreignKey: 'lessonId',
    });

    // QuestionGroup relationships
    db.QuestionGroup.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
    });

    db.QuestionGroup.hasMany(db.questionGroupAttempt, {
      foreignKey: 'questionGroupId',
    });

    // Question relationships
    db.Question.belongsTo(db.QuestionGroup, {
      foreignKey: 'groupId',
    });

    // LessonAttempt relationships
    db.LessonAttempt.belongsTo(db.User, {
      foreignKey: 'userId',
    });

    db.LessonAttempt.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
    });

    db.LessonAttempt.hasMany(db.questionGroupAttempt, {
      foreignKey: 'lessonAttemptId',
    });

    // QuestionGroupAttempt relationships
    db.questionGroupAttempt.belongsTo(db.LessonAttempt, {
      foreignKey: 'lessonAttemptId',
    });

    db.questionGroupAttempt.belongsTo(db.QuestionGroup, {
      foreignKey: 'questionGroupId',
    });

    db.questionGroupAttempt.hasMany(db.QuestionAttempt, {
      foreignKey: 'groupAttemptId',
    });

    // QuestionAttempt relationships
    db.QuestionAttempt.belongsTo(db.questionGroupAttempt, {
      foreignKey: 'groupAttemptId',
    });

    db.QuestionAttempt.belongsTo(db.Question, {
      foreignKey: 'questionId',
    });

    console.log('All models created successfully');
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
    console.log('Connected to database successfully');
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
    console.log('All migrations performed successfully');
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
