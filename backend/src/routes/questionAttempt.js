const express = require('express');
const { getQuestionAttempts } = require('../controllers/questionAttempt');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getQuestionAttempts);

module.exports = router;
