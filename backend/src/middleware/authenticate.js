const { verifyToken } = require('../_utils');
const db = require('../db');

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const { teacherId } = await verifyToken(token);
  const teacher = await db.Teacher.findByPk(teacherId);
  if (!teacher) {
    return res.status(404).send({ message: 'User not found' });
  }
  req.teacher = teacher;

  next();
};

module.exports = {
  isAuthenticated,
};
