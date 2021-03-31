const db = require('../db');

const getQuestionGroupAttempts = async (req, res) => {
  const {
    query: { questionGroupId },
  } = req;

  if (!questionGroupId) {
    return res.status(400).send({
      message: 'Please provide one of the following: questionGroupId',
    });
  }

  const questionGroupAttemptWhere = questionGroupId ? { questionGroupId } : {};

  const questionGroupAttempts = await db.QuestionGroupAttempt.findAll({
    where: questionGroupAttemptWhere,
  });

  res.status(200).send({ data: questionGroupAttempts });
};

module.exports = { getQuestionGroupAttempts };
