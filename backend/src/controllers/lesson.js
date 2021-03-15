const db = require('../db');

const getLessons = async (req, res) => {
  const { user } = req;
  const lessons = await db.Lesson.findAll({
    through: {
      model: db.UserLessonGroup,
      where: {
        teacherId: user.id,
      },
    },
  });
  res.status(200).send({ data: lessons });
};

const getLessonsInGroup = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;

  const lessons = await db.Lesson.findAll({
    through: {
      model: db.UserLessonGroup,
      where: {
        teacherId: user.id,
      },
      through: {
        model: db.LessonGroup,
        where: {
          id,
        },
      },
    },
  });

  res.status(200).send({ data: lessons });
};

const getLessonDetails = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;

  const data = await db.Lesson.findAll({
    where: {
      id,
    },
    through: {
      model: db.UserLessonGroup,
      where: {
        teacherId: user.id,
      },
    },
    include: [{ model: db.QuestionGroup, include: [{ model: db.Question }] }],
  });

  res.status(200).send({ data });
};

module.exports = { getLessons, getLessonsInGroup, getLessonDetails };
