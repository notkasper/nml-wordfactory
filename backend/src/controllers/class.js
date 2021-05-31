const db = require('../db');

const getClasses = async (req, res) => {
  const { teacher } = req;

  const classes = await teacher.getClasses({
    include: [
      {
        model: db.Student,
        as: 'students',
      },
    ],
  });

  res.status(200).send({ data: classes });
};

const getClass = async (req, res) => {
  const theClass = await db.Class.findByPk(req.params.id);
  if (!theClass) {
    return res.status(404).send({ message: 'Class not found' });
  }

  const teachers = await theClass.getTeachers();
  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res.status(404).send({ message: 'Class not found' });
  }

  res.status(200).send({ data: theClass });
};

const getCategories = async (req, res) => {
  const allCategories = new Map();
  const theClass = await db.Class.findByPk(req.params.id);

  if (!theClass) {
    return res.status(404).send({ message: 'Class not found' });
  }

  const teachers = await theClass.getTeachers();
  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res.status(404).send({ message: 'Class not found' });
  }

  const questionGroupAttempts = await theClass.getQuestionGroupAttempts({
    attributes: ['correct', 'incorrect', 'missed'],
    include: [
      {
        model: db.QuestionGroup,
        as: 'questionGroup',
        attributes: ['id'],
        include: [
          { model: db.Question, as: 'questions', attributes: ['contentTags'] },
        ],
      },
    ],
  });

  for (const questionGroupAttempt of questionGroupAttempts) {
    const [question] = questionGroupAttempt.questionGroup.questions;
    const tag = question.contentTags[0];

    if (!allCategories.has(tag)) {
      allCategories.set(tag, { correct: 0, incorrect: 0 });
    }

    const total = allCategories.get(tag);

    const { correct, incorrect, missed } = questionGroupAttempt;
    total.correct += correct || 0;
    total.incorrect += incorrect || 0;
    total.incorrect += missed || 0;

    allCategories.set(tag, total);
  }

  const data = [];
  for (const [key, value] of allCategories.entries()) {
    if (value.correct === 0 && value.incorrect === 0) {
      continue;
    } else {
      data.push({
        key,
        correctness: Math.round(
          (value.correct / (value.correct + value.incorrect)) * 100
        ),
      });
    }
  }

  res
    .status(200)
    .send({ data: data.sort((a, b) => b.correctness - a.correctness) });
};

module.exports = { getClasses, getClass, getCategories };
