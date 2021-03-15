const getLessonGroups = async (req, res) => {
  const { user } = req;
  const lessonGroups = await user.getLessonGroups();
  res.status(200).send({ data: lessonGroups });
};

module.exports = { getLessonGroups };
