const express = require('express');
const {
  getQuestionAttempts,
  getQuestionAttemptsID,
} = require('../controllers/questionAttempt');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getQuestionAttempts);
router.route('/:id').get(isAuthenticated, getQuestionAttemptsID);

module.exports = router;
