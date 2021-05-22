const db = require('../db');

const getLessonAttempts = async (req, res) => {
  const {
    query: { lessonId, studentId },
  } = req;

  if (!lessonId && !studentId) {
    return res.status(400).send({
      message: 'Please provide one of the following: lessonId, studentId',
    });
  }

  const studentWhere = studentId ? { studentId } : {};
  const lessonWhere = lessonId ? { id: lessonId } : {};

  const lessonAttempts = await db.LessonAttempt.findAll({
    where: studentWhere,
    include: [
      {
        model: db.Student,
        as: 'student',
        attributes: ['id', 'name'],
      },
      {
        model: db.QuestionGroupAttempt,
        as: 'questionGroupAttempts',
      },
      {
        model: db.Lesson,
        as: 'lesson',
        where: lessonWhere,
      },
    ],
  });

  res.status(200).send({ data: lessonAttempts });
};

module.exports = { getLessonAttempts };
