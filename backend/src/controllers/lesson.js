const db = require('../db');

const getLessons = async (req, res) => {
  const {
    query: { courseId },
  } = req;

  if (!courseId) {
    return res
      .status(400)
      .send({ message: 'Please provide one of the following: courseId' });
  }

  const course = await db.Course.findByPk(courseId);
  const theClass = await course.getClass();
  const teachers = await theClass.getTeachers();
  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res.status(404).send({ message: 'Course not found' });
  }

  const lessons = await course.getLessons();

  await res.status(200).send({ data: lessons });
};

const getLesson = async (req, res) => {
  const {
    params: { id },
  } = req;

  const lesson = await db.Lesson.findOne({
    where: {
      id,
    },
    include: [
      {
        model: db.QuestionGroup,
        as: 'questionGroups',
        include: [
          {
            model: db.Question,
            as: 'questions',
          },
          {
            model: db.QuestionGroupAttempt,
            as: 'questionGroupAttempts',
            attributes: ['correct', 'incorrect', 'missed', 'isCompleted'],
          },
        ],
      },
    ],
  });
  if (!lesson) {
    return res.status(404).send({ message: 'Lesson not found' });
  }

  const course = await lesson.getCourse();
  const theClass = await course.getClass();
  const teachers = await theClass.getTeachers();
  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res.status(404).send({ message: 'Lesson not found' });
  }

  await res.status(200).send({ data: lesson });
};

module.exports = {
  getLessons,
  getLesson,
};
