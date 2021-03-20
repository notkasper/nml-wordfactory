const { checkPassword, generateToken } = require('../_utils');
const db = require('../db');

const login = async (req, res) => {
  const invalidLoginMessage = 'Invalid username or password, please try again.';
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: invalidLoginMessage });
    return;
  }

  const teacher = await db.Teacher.findOne({ where: { email } });
  if (!teacher) {
    res.status(401).send({ message: invalidLoginMessage });
    return;
  }

  const validCredentials = await checkPassword(
    password,
    teacher.passwordEncrypted
  );
  if (!validCredentials) {
    // invalid password
    res.status(401).send({ message: invalidLoginMessage });
    return;
  }

  // correct password
  const data = { teacherId: teacher.id };
  const token = generateToken(data);
  res.cookie('token', token).status(200).send({ message: 'OK' });
};

const teacherTest = (req, res) => {
  res.status(200).send({ message: 'Hello Teacher!' });
};

module.exports = { login, teacherTest };
