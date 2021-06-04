const express = require('express');
const {
  getQuestionGroups,
  getQuestionGroupsByLessonId,
} = require('../controllers/questionGroup');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getQuestionGroups);
router
  .route('/lesson/:lessonId')
  .get(isAuthenticated, getQuestionGroupsByLessonId);

module.exports = router;
