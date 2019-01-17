const express = require('express');

const router = express.Router();

router.use('/maps', require('./maps'));
router.use('/totals', require('./totals'));

module.exports = router;
