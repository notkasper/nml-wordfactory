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
      '$question.questions.questionGroups.Course.Class.teachers.id$':
        teacher.id,
      '$question.questions.questionGroups.id$': lessonId,
      '$questionGroupAttempts.lessonAttempts.student.id$': studentId,
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
        as: 'questionGroupAttempts',
        include: [
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
    ],
    order: [['updatedAt', 'DESC']],
  });

  res.status(200).send({ data: questionAttempts });
};

module.exports = { getQuestionAttempts };
