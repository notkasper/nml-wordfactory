const db = require('../db');

const getQuestionGroups = async (req, res) => {
  const { ids } = req.query;
  const idsParsed = JSON.parse(ids);
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
            as: 'lessonAttempts',
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
  const { lessonId } = req.params;
  const lesson = await db.Lesson.findByPk(lessonId);

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
            as: 'lessonAttempts',
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
