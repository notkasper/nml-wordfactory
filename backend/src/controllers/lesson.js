const getLessons = async (req, res) => {
  const { user } = req;
  const lessons = await user.getLessons();
  res.status(200).send({ data: lessons });
};

module.exports = { getLessons };
