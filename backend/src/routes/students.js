const express = require('express');
const {
  getStudents,
  getStudent,
  getCategories,
} = require('../controllers/students');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

router.route('/').get(isAuthenticated, getStudents);
router.route('/:id').get(isAuthenticated, getStudent);
router.route('/:id/categories').get(isAuthenticated, getCategories);

module.exports = router;
