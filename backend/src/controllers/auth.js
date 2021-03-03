const { checkPassword, generateToken } = require('../_utils');
const db = require('../db');

const login = async (req, res) => {
  const invalidLoginMessage = 'Invalid username or password, please try again.';
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: invalidLoginMessage });
    return;
  }

  const user = await db.User.findOne({ where: { email, role: 'teacher' } });
  if (!user) {
    res.status(401).send({ message: invalidLoginMessage });
    return;
  }

  const validCredentials = await checkPassword(
    password,
    user.passwordEncrypted
  );
  if (!validCredentials) {
    // invalid password
    res.status(401).send({ message: invalidLoginMessage });
    return;
  }

  // correct password
  const data = { userId: user.id };
  const token = generateToken(data);
  res.status(200).send({ token });
};

const teacherTest = (req, res) => {
  res.status(200).send({ message: 'Hello Teacher!' });
};

module.exports = { login, teacherTest };
