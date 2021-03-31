const db = require('../db');

const getCourses = async (req, res) => {
  const {
    query: { classId, studentId },
  } = req;

  if (!classId && !studentId) {
    return res.status(400).send({
      message: 'Please provide one of the following: classId, studentId',
    });
  }

  const studentWhere = studentId ? { studentId } : {};
  const courseWhere = classId ? { classId } : {};

  const courses = await db.Course.findAll({
    where: courseWhere,
    include: [
      {
        model: db.Lesson,
        as: 'lessons',
        include: {
          model: db.LessonAttempt,
          as: 'lessonAttempts',
          where: studentWhere,
        },
      },
    ],
    order: [[{ model: db.Lesson, as: 'lessons' }, 'index', 'ASC']],
  });

  res.status(200).send({ data: courses });
};

module.exports = { getCourses };
