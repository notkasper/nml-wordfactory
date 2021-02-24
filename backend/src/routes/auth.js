const express = require('express');
const { login, teacherAuthCheck } = require('../controllers/auth');
const { isTeacher } = require('../middleware/authenticate');

const router = express.Router();

router.route('/login').post(login);
router.route('/teacherTest').get(isTeacher, teacherAuthCheck);

module.exports = router;
