const express = require('express');
const { login, teacherTest } = require('../controllers/auth');
const { isAuthenticated, isTeacher } = require('../middleware/authenticate');

const router = express.Router();

router.route('/login').post(login);

module.exports = router;
