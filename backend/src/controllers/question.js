const db = require('../db');

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const question = await db.Question.findByPk(id);
  if (!question) {
    return res.status(404).send({ message: 'Question not found' });
  }
  question.data = data;
  await question.save();

  res.status(200).send({ message: 'OK' });
};

module.exports = { updateQuestion };
