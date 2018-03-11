const express = require('express');

const router = express.Router();

router.use('/maps', require('./maps'));

module.exports = router;
