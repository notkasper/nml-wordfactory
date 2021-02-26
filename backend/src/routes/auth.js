const express = require('express');
const { login, teacherTest } = require('../controllers/auth');
const { isAuthenticated, isTeacher } = require('../middleware/authenticate');

const router = express.Router();

router.route('/login').post(login);
router.route('/teacherTest').get(isAuthenticated, isTeacher, teacherTest);

module.exports = router;
