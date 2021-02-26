const express = require('express');
const { getLessons } = require('../controllers/lesson');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getLessons);

module.exports = router;
