const db = require('../db');

const getQuestionGroupAttempts = async (req, res) => {
  const {
    teacher,
    query: { questionGroupId, pageSize },
  } = req;

  let questionGroupAttempts;

  if (questionGroupId) {
    questionGroupAttempts = await db.QuestionGroupAttempt.findAll({
      where: { questionGroupId },
    });
  } else {
    questionGroupAttempts = await db.QuestionGroupAttempt.findAll({
      where: {
        '$class.teachers.id$': teacher.id,
      },
      attributes: ['id', 'isCompleted', 'updatedAt'],
      include: [
        {
          model: db.QuestionGroup,
          as: 'questionGroup',
        },
        {
          model: db.Lesson,
          as: 'lesson',
        },
        {
          model: db.Class,
          as: 'class',
          attributes: ['id'],
          include: [
            {
              model: db.Teacher,
              as: 'teachers',
              attributes: ['id'],
            },
          ],
        },
        {
          model: db.LessonAttempt,
          as: 'lessonAttempts',
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
      subQuery: false,
    });
  }

  res.status(200).send({ data: questionGroupAttempts });
};

module.exports = { getQuestionGroupAttempts };
