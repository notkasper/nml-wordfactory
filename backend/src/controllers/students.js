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
    include: [{ model: db.Student, as: 'students' }],
  });

  const students = classes.reduce((acc, curr) => {
    acc.push(curr.students);
    return acc;
  }, []);

  res.status(200).send({ data: students });
};

const getStudent = async (req, res) => {
  const { id } = req.params;

  const student = await db.Student.findByPk(id);

  res.status(200).send({ data: student });
};

module.exports = { getStudents, getStudent };
