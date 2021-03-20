const express = require('express');
const { getCourses } = require('../controllers/course');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getCourses);

module.exports = router;
