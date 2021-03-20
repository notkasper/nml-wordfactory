const db = require('../db');

const getClasses = async (req, res) => {
  const { teacher } = req;

  res.status(500).send({ message: 'error handler test' });

  const classes = await teacher.getClasses();

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

module.exports = { getClasses, getClass };
