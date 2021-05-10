const uuid = require('uuid');

const db = require('../db');

const getQuestionGroupAttempts = async (req, res) => {
  const {
    params: { questionGroupId },
  } = req;

  if (!questionGroupId) {
    return res.status(400).send({
      message: 'Please provide one of the following: questionGroupId',
    });
  }

  const questionGroupAttemptWhere = questionGroupId ? { questionGroupId } : {};

  const questionGroupAttempts = await db.QuestionGroupAttempt.findAll({
    where: questionGroupAttemptWhere,
  });

  res.status(200).send({ data: questionGroupAttempts });
};

const getAllQuestionGroupAttempts = async (req, res) => {
  const {
    teacher,
    query: { pageSize },
  } = req;

  const questionGroupAttempts = await db.QuestionGroupAttempt.findAll({
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

  res.status(200).send({ data: questionGroupAttempts });
};

module.exports = { getQuestionGroupAttempts, getAllQuestionGroupAttempts };
