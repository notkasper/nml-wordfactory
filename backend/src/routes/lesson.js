const express = require('express');
const {
  getLessons,
  getLessonsInGroup,
  getLessonDetails,
} = require('../controllers/lesson');
const { isAuthenticated, isTeacher } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, isTeacher, getLessons);
router.route('/:id').get(isAuthenticated, isTeacher, getLessonDetails);
router.route('/group/:id').get(isAuthenticated, isTeacher, getLessonsInGroup);

module.exports = router;
