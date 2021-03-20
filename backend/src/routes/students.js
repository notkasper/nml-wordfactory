const express = require('express');
const { getStudents } = require('../controllers/students');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getStudents);

module.exports = router;
