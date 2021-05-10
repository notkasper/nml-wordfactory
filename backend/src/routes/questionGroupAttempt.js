const express = require('express');
const {
  getQuestionGroupAttempts,
  getAllQuestionGroupAttempts,
} = require('../controllers/questionGroupAttempt');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getAllQuestionGroupAttempts);

router
  .route('/questionGroupId/:questionGroupId')
  .get(isAuthenticated, getQuestionGroupAttempts);

module.exports = router;
