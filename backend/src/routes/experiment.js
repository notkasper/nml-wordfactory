const express = require('express');
const { main } = require('../controllers/experiment');

const router = express.Router();

router.route('/:stage').post(main);

module.exports = router;
