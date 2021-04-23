const express = require('express');
const { updateQuestion } = require('../controllers/question');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/:id').patch(isAuthenticated, updateQuestion);

module.exports = router;
