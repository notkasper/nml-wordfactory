const getClasses = async (req, res) => {
  const { teacher } = req;

  const classes = await teacher.getClasses();

  res.status(200).send({ data: classes });
};

module.exports = { getClasses };
