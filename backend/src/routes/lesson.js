const express = require('express');
const { getLessons, getLesson } = require('../controllers/lesson');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getLessons);
router.route('/:id').get(isAuthenticated, getLesson);

module.exports = router;
