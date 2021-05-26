const db = require('../db');

const getStudents = async (req, res) => {
  const {
    query: { classId },
  } = req;

  const where = {};
  // add optional query parameters
  if (classId) {
    where.id = classId;
  }

  const classes = await req.teacher.getClasses({
    where,
    include: [
      {
        model: db.Student,
        as: 'students',
        include: [
          {
            model: db.Class,
            as: 'classes',
          },
          {
            model: db.LessonAttempt,
            as: 'lessonAttempts',
            include: [
              {
                model: db.QuestionGroupAttempt,
                as: 'questionGroupAttempts',
              },
            ],
          },
        ],
      },
    ],
  });

  const students = classes.reduce((acc, curr) => {
    acc.push(...curr.students);
    return acc;
  }, []);

  res.status(200).send({ data: students });
};

const getStudent = async (req, res) => {
  const { id } = req.params;

  const student = await db.Student.findByPk(id);

  res.status(200).send({ data: student });
};

const getCategories = async (req, res) => {
  const { id } = req.params;
  const allCategories = new Map();

  const student = await db.Student.findByPk(id);
  const questionGroupAttempts = await student.getQuestionGroupAttempts();
  for (const questionGroupAttempt of questionGroupAttempts) {
    const questionGroup = await questionGroupAttempt.getQuestionGroup();
    const questions = await questionGroup.getQuestions({ raw: true });

    // TODO: it now only deals with the first content tag of the first subquestion!
    const [question] = questions;

    const tag = question.contentTags[0];

    if (!allCategories.has(tag)) {
      allCategories.set(tag, { correct: 0, incorrect: 0 });
    }

    const total = allCategories.get(tag);
    if (questionGroupAttempt.correct) {
      total.correct += questionGroupAttempt.correct;
    }

    if (questionGroupAttempt.incorrect) {
      total.incorrect += questionGroupAttempt.incorrect;
    }

    if (questionGroupAttempt.missed) {
      total.incorrect += questionGroupAttempt.missed;
    }

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

module.exports = { getStudents, getStudent, getCategories };
