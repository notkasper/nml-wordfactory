const express = require('express');
const {
  getQuestionGroupAttempts,
} = require('../controllers/questionGroupAttempt');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getQuestionGroupAttempts);

module.exports = router;
