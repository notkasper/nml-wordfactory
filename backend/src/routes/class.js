const express = require('express');
const { getClasses, getClass } = require('../controllers/class');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getClasses);
router.route('/:id').get(isAuthenticated, getClass);

module.exports = router;
