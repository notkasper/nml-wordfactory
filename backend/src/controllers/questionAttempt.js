const db = require('../db');

const getQuestionAttempts = async (req, res) => {
  const {
    teacher,
    query: { studentId, lessonId },
  } = req;

  if (!studentId || !lessonId) {
    return res.status(400).send({
      message: 'Please provide one of the following: studentId, lessonId',
    });
  }

  const questionAttempts = await db.QuestionAttempt.findAll({
    where: {
      '$Class.teachers.id$': teacher.id,
      lessonId,
      studentId,
    },
    include: [
      {
        model: db.Question,
        as: 'question',
        include: [
          {
            model: db.QuestionGroup,
            as: 'questions',
            attributes: ['id', 'index', 'name'],
          },
        ],
      },
      {
        model: db.Class,
        as: 'Class',
        attributes: ['id'],
        include: [
          {
            model: db.Teacher,
            as: 'teachers',
            attributes: ['id'],
          },
        ],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });

  res.status(200).send({ data: questionAttempts });
};

module.exports = { getQuestionAttempts };
