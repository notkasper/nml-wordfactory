const { verifyToken } = require('../_utils');
const db = require('../db');

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  const { teacherId } = await verifyToken(token);
  const teacher = await db.Teacher.findByPk(teacherId);
  if (!teacher) {
    return res.status(404).send({ message: 'User not found' });
  }
  req.teacher = teacher;

  next();
};

const teachesCourse = async (req, res, next) => {
  const course = await db.Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).send({ message: 'Course not found' });
  }

  const teachers = await course.getTeachers();

  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res
      .status(401)
      .send({ message: 'You are not a teacher of this class' });
  }
  req.course = course;

  next();
};

const teachesClass = async (req, res, next) => {
  const theClass = await db.Class.findByPk(req.params.id);
  if (!theClass) {
    return res.status(404).send({ message: 'Class not found' });
  }
  const course = await theClass.getCourse();
  const teachers = await course.getTeachers();

  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res
      .status(401)
      .send({ message: 'You are not a teacher of this lesson' });
  }
  req.class = theClass;

  next();
};

const teachesLesson = async (req, res, next) => {
  const lesson = await db.Lesson.findByPk(req.params.id);
  if (!lesson) {
    return res.status(404).send({ message: 'Lesson not found' });
  }
  const course = await lesson.getCourse();
  const theClass = await course.getClass();
  const teachers = await theClass.getTeachers();

  if (!teachers.find((teacher) => teacher.id === req.teacher.id)) {
    return res
      .status(401)
      .send({ message: 'You are not a teacher of this lesson' });
  }
  req.lesson = lesson;

  next();
};

module.exports = {
  isAuthenticated,
  teachesCourse,
  teachesClass,
  teachesLesson,
};
