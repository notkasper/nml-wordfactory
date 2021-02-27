const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

/* ADD MODELS HERE */
const User = require('./models/user');
const Lesson = require('./models/lesson');
const Question = require('./models/question');
const LessonAttempt = require('./models/lessonAttempt');
const Answer = require('./models/answer');
const TeacherStudent = require('./models/teacherStudent');
const UserLesson = require('./models/userLesson');

const db = {};

// models and relationships can be found at this url: https://drawsql.app/radboud-university/diagrams/wordfactory-teacher-dashboard
db.setupModels = async () => {
  try {
    // models
    db.User = User(db.sequelize);
    db.Lesson = Lesson(db.sequelize);
    db.Question = Question(db.sequelize);
    db.LessonAttempt = LessonAttempt(db.sequelize);
    db.Answer = Answer(db.sequelize);

    // join tables
    db.TeacherStudent = TeacherStudent(db.sequelize);
    db.UserLesson = UserLesson(db.sequelize);

    // relationships
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

    db.User.belongsToMany(db.Lesson, {
      as: 'Lessons',
      through: db.UserLesson,
      foreignKey: 'userId',
    });

    db.User.hasMany(db.LessonAttempt, {
      foreignKey: 'userId',
    });

    db.Lesson.hasMany(db.Question, {
      foreignKey: 'lessonId',
    });

    db.Lesson.hasMany(db.LessonAttempt, {
      foreignKey: 'lessonId',
    });

    db.Lesson.belongsToMany(db.User, {
      as: 'Users',
      through: db.UserLesson,
      foreignKey: 'lessonId',
    });

    db.LessonAttempt.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
    });

    db.LessonAttempt.belongsTo(db.User, {
      foreignKey: 'userId',
    });

    db.Question.belongsTo(db.Lesson, {
      foreignKey: 'lessonId',
    });

    db.Answer.belongsTo(db.LessonAttempt, {
      foreignKey: 'lessonAttemptId',
    });

    db.Answer.belongsTo(db.Question, {
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
