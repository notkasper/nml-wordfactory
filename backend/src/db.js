const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

const seed = require('./seed');

/* ADD MODELS HERE */
const Teacher = require('./models/teacher');
const Student = require('./models/student');
const Lesson = require('./models/lesson');
const Question = require('./models/question');
const LessonAttempt = require('./models/lessonAttempt');
const Answer = require('./models/answer');
const TeacherStudent = require('./models/teacherStudent');
const StudentLesson = require('./models/studentLesson');
const TeacherLesson = require('./models/teacherLesson');

const db = {};

// models and relationships can be found at this url: https://drawsql.app/radboud-university/diagrams/wordfactory-teacher-dashboard
db.setupModels = async () => {
  try {
    // models
    db.Teacher = Teacher(db.sequelize);
    db.Student = Student(db.sequelize);
    db.Lesson = Lesson(db.sequelize);
    db.Question = Question(db.sequelize);
    db.LessonAttempt = LessonAttempt(db.sequelize);
    db.Answer = Answer(db.sequelize);

    // join tables
    db.TeacherStudent = TeacherStudent(db.sequelize);
    db.StudentLesson = StudentLesson(db.sequelize);
    db.TeacherLesson = TeacherLesson(db.sequelize);

    // relationships
    db.Teacher.belongsToMany(db.Student, { through: db.TeacherStudent });
    db.Teacher.belongsToMany(db.Lesson, { through: db.TeacherLesson });

    db.Student.belongsToMany(db.Teacher, { through: db.TeacherStudent });
    db.Student.belongsToMany(db.Lesson, { through: db.StudentLesson });
    db.Student.hasMany(db.LessonAttempt);

    db.Lesson.belongsToMany(db.Teacher, { through: db.TeacherLesson });
    db.Lesson.belongsToMany(db.Student, { through: db.StudentLesson });
    db.Lesson.hasMany(db.Question);
    db.Lesson.hasMany(db.LessonAttempt);

    db.LessonAttempt.belongsTo(db.Lesson);
    db.LessonAttempt.belongsTo(db.Student);

    db.Question.belongsTo(db.Lesson);

    db.Answer.belongsTo(db.LessonAttempt);
    db.Answer.belongsTo(db.Question);

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

  if (process.env.NODE_ENV === 'development') {
    await seed(db);
  }
};

module.exports = db;
