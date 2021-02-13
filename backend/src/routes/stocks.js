const express = require('express');
const { queryStock } = require('../controllers/stocks');

const router = express.Router();

router.route('/:ticker').get(queryStock);

module.exports = router;
