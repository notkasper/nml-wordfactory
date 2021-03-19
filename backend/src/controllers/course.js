const db = require('../db');

const getCourses = async (req, res) => {
  const {
    query: { classId },
  } = req;

  if (!classId) {
    return res
      .status(400)
      .send({ message: 'Please provide one of the following: classId' });
  }

  const theClass = await db.Class.findByPk(classId);
  if (!theClass) {
    return res.status(404).send({ message: 'Class not found' });
  }

  const teachers = await theClass.getTeachers();
  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res.status(404).send({ message: 'Class not found' });
  }

  const courses = await theClass.getCourses({
    include: { model: db.Lesson, as: 'lessons' },
  });

  res.status(200).send({ data: courses });
};

module.exports = { getCourses };
