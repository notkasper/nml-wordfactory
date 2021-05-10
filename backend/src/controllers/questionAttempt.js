const db = require('../db');

const getQuestionAttempts = async (req, res) => {
  const {
    teacher,
    query: { pageSize },
  } = req;

  const classes = await teacher.getClasses();
  let questionGroups = [];
  for (const theClass of classes) {
    const courses = await theClass.getCourses();
    for (const course of courses) {
      const lessons = await course.getLessons();
      for (const lesson of lessons) {
        questionGroups = await lesson.getQuestionGroups();
      }
    }
  }

  const questionAttempts = await db.QuestionGroupAttempt.findAll({
    where: {
      questionGroupId: questionGroups.map((e) => e.id),
    },
    attributes: ['id', 'isCompleted', 'updatedAt'],
    include: [
      {
        model: db.QuestionGroup,
        as: 'QuestionGroup',
        attributes: ['id', 'index', 'name'],
        include: [
          {
            model: db.Lesson,
            as: 'questionGroups',
            attributes: ['id', 'index', 'prefix', 'instruction', 'name'],
          },
        ],
      },
      {
        model: db.LessonAttempt,
        as: 'LessonAttempt',
        attributes: ['id'],
        include: [
          {
            model: db.Student,
            as: 'student',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
    order: [['updatedAt', 'DESC']],
    limit: pageSize || 50,
  });

  res.status(200).send({ data: questionAttempts });
};

const getQuestionAttemptsID = async (req, res) => {
  const {
    teacher,
    query: { questionId },
  } = req;

  const classes = await teacher.getClasses();
  let questionGroups = [];
  for (const theClass of classes) {
    const courses = await theClass.getCourses();
    for (const course of courses) {
      const lessons = await course.getLessons();
      for (const lesson of lessons) {
        questionGroups = await lesson.getQuestionGroups();
      }
    }
  }

  const questionAttemptsID = await db.QuestionGroupAttempt.findAll({
    where: {
      questionGroupId: questionGroups.map((e) => e.id),
      questionId: questionId,
    },
    attributes: ['id', 'isCompleted', 'updatedAt'],
    include: [
      {
        model: db.QuestionGroup,
        as: 'QuestionGroup',
        attributes: ['id', 'index', 'name'],
        include: [
          {
            model: db.Lesson,
            as: 'questionGroups',
            attributes: ['id', 'index', 'prefix', 'instruction', 'name'],
          },
        ],
      },
      {
        model: db.LessonAttempt,
        as: 'LessonAttempt',
        attributes: ['id'],
        include: [
          {
            model: db.Student,
            as: 'student',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });

  res.status(200).send({ data: questionAttemptsID });
};

module.exports = { getQuestionAttempts, getQuestionAttemptsID };
