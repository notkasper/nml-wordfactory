const db = require('../db');

const getLessonAttempts = async (req, res) => {
  const {
    query: { lessonId },
  } = req;

  if (!lessonId) {
    return res
      .status(400)
      .send({ message: 'Please provide one of the following: lessonId' });
  }

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

  const students = await theClass.getStudents();
  const lessonAttempts = await lesson.getLessonAttempts({
    include: [
      {
        model: db.Student,
        as: 'student',
      },
      {
        model: db.QuestionGroupAttempt,
        as: 'questionGroupAttempts',
      },
    ],
  });

  res.status(200).send({ data: lessonAttempts });
};

module.exports = { getLessonAttempts };
