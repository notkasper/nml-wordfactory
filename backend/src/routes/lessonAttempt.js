const express = require('express');
const { getLessonAttempts } = require('../controllers/lessonAttempt');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getLessonAttempts);

module.exports = router;
