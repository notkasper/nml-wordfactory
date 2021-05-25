const express = require('express');
const {
  getClasses,
  getClass,
  getProblemCategories,
} = require('../controllers/class');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getClasses);
router.route('/:id').get(isAuthenticated, getClass);
router
  .route('/:id/problem_categories')
  .get(isAuthenticated, getProblemCategories);

module.exports = router;
