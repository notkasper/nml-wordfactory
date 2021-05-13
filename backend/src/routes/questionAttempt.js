const express = require('express');
const {
  getQuestionAttempts,
  getQuestionAttemptsID,
} = require('../controllers/questionAttempt');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getQuestionAttempts);

module.exports = router;
