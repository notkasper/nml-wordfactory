const { verifyToken } = require('../_utils');
const db = require('../db');

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  const { userId } = await verifyToken(token);
  const user = await db.User.findByPk(userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  req.user = user;

  next();
};

const isTeacher = async (req, res, next) => {
  if (!req.user.role === 'teacher') {
    return res
      .status(401)
      .send({ message: 'Only teachers can access this route' });
  }

  next();
};

const isStudent = (req, res, next) => {
  if (!req.user.role === 'student') {
    return res
      .status(401)
      .send({ message: 'Only students can access this route' });
  }

  next();
};

module.exports = { isTeacher, isStudent, isAuthenticated };
