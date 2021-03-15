const express = require('express');
const { getLessonGroups } = require('../controllers/lessonGroup');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getLessonGroups);

module.exports = router;
