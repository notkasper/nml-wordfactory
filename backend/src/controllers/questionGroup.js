const db = require('../db');

const getQuestionGroup = async (req, res) => {
  const {
    params: { id },
  } = req;

  const questionGroup = await db.QuestionGroup.findByPk(id, {
    include: [
      {
        model: db.QuestionGroupAttempt,
        as: 'questionGroupAttempts',
        include: [{ model: db.QuestionAttempt, as: 'questionAttempts' }],
      },
      {
        model: db.Question,
        as: 'questions',
      },
    ],
  });

  res.status(200).send({ data: questionGroup });
};

module.exports = { getQuestionGroup };
