const express = require('express');
const { getClasses } = require('../controllers/class');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getClasses);

module.exports = router;
