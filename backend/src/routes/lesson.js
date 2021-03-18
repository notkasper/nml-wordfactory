const express = require('express');
const {
  getLessons,
  getLessonsInGroup,
  getLessonDetails,
  getStudents,
} = require('../controllers/lesson');
const {
  isAuthenticated,
  isTeacher,
  isLessonTeacher,
} = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, isTeacher, getLessons);
router.route('/:id').get(isAuthenticated, isTeacher, getLessonDetails);
router
  .route('/:id/students')
  .get(isAuthenticated, isLessonTeacher, getStudents);
router.route('/group/:id').get(isAuthenticated, isTeacher, getLessonsInGroup);

module.exports = router;
