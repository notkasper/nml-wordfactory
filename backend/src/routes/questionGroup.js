const express = require('express');
const { getQuestionGroup } = require('../controllers/questionGroup');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/:id').get(isAuthenticated, getQuestionGroup);

module.exports = router;
