const { verifyToken } = require('../_utils');

const isTeacher = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(403).json({ message: 'No bearer token provided.' });
    return;
  }

  const [, token] = bearer.split(' ');
  const decoded = await verifyToken(token);
  req.teacher_id = decoded.teacher_id;

  next();
};

const isStudent = (req, res, next) => {
  throw new Error('isStudent middleware is not implemented');
};

module.exports = { isTeacher, isStudent };
