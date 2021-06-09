const db = require('../db');

const getQuestionGroups = async (req, res) => {
  const {
    query: { ids },
  } = req;

  const idsParsed = JSON.parse(ids);

  // TODO: do not retrieve entire db at once, this needs fixing!
  const questionGroups = await db.QuestionGroup.findAll({
    where: { id: idsParsed },
    include: [
      {
        model: db.QuestionGroupAttempt,
        as: 'questionGroupAttempts',
        include: [
          {
            model: db.QuestionAttempt,
            as: 'questionAttempts',
          },
          {
            model: db.LessonAttempt,
            as: 'lessonAttempt',
            include: [
              {
                model: db.Student,
                as: 'student',
              },
            ],
          },
        ],
      },
      {
        model: db.Question,
        as: 'questions',
      },
    ],
  });

  res.status(200).send({ data: questionGroups });
};

const getQuestionGroupsByLessonId = async (req, res) => {
  const {
    params: { lessonId },
  } = req;

  const lesson = await db.Lesson.findByPk(lessonId);
  if (!lesson) {
    return res.status(404).send({ message: 'Lesson not found' });
  }

  const course = await lesson.getCourse();
  const theClass = await course.getClass();
  const teachers = await theClass.getTeachers();
  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res.status(404).send({ message: 'Lesson not found' });
  }

  // TODO: do not retrieve entire db at once, this needs fixing!
  const questionGroups = await lesson.getQuestionGroups({
    include: [
      {
        model: db.QuestionGroupAttempt,
        as: 'questionGroupAttempts',
        include: [
          {
            model: db.QuestionAttempt,
            as: 'questionAttempts',
          },
          {
            model: db.LessonAttempt,
            as: 'lessonAttempt',
            include: [
              {
                model: db.Student,
                as: 'student',
              },
            ],
          },
        ],
      },
      {
        model: db.Question,
        as: 'questions',
      },
    ],
  });

  res.status(200).send({ data: questionGroups });
};

module.exports = { getQuestionGroups, getQuestionGroupsByLessonId };
