const express = require('express');
const { getClasses, getClass, getCategories } = require('../controllers/class');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getClasses);
router.route('/:id').get(isAuthenticated, getClass);
router.route('/:id/categories').get(isAuthenticated, getCategories);

module.exports = router;
