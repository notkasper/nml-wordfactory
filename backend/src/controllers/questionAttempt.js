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
      '$Question.questions.questionGroups.Course.Class.teachers.id$':
        teacher.id,
      '$Question.questions.questionGroups.id$': lessonId,
      '$QuestionGroupAttempt.LessonAttempt.student.id$': studentId,
    },
    include: [
      {
        model: db.Question,
        as: 'Question',
        include: [
          {
            model: db.QuestionGroup,
            as: 'questions',
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
        ],
      },
      {
        model: db.QuestionGroupAttempt,
        as: 'QuestionGroupAttempt',
        include: [
          {
            model: db.LessonAttempt,
            as: 'LessonAttempt',
            include: [
              {
                model: db.Student,
                as: 'student',
              },
            ],
          },
        ],
      },
    ],
    order: [['updatedAt', 'DESC']],
    //limit: pageSize || 50,
  });

  res.status(200).send({ data: questionAttempts });
};

module.exports = { getQuestionAttempts };
