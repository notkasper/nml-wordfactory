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
        '$QuestionGroup.questionGroups.Course.Class.teachers.id$': teacher.id,
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
              include: [
                {
                  model: db.Course,
                  as: 'Course',
                  attributes: ['id'],
                  include: [
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
                },
              ],
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
      subQuery: false,
    });
  }

  res.status(200).send({ data: questionGroupAttempts });
};

module.exports = { getQuestionGroupAttempts };
