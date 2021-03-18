const express = require('express');
const { getLessonGroups } = require('../controllers/lessonGroup');
const { isAuthenticated, isTeacher } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, isTeacher, getLessonGroups);

module.exports = router;
