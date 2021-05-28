const express = require('express');
const { getQuestionGroups } = require('../controllers/questionGroup');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getQuestionGroups);

module.exports = router;
