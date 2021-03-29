const express = require('express');
const { getStudents, getStudent } = require('../controllers/students');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getStudents);
router.route('/:id').get(isAuthenticated, getStudent);

module.exports = router;
