const express = require('express');

const router = express.Router();

router.use('*', (req, res, next) => {
	// Middleware to check auth. Only for /api router, move to app.use() for application auth
	res.locals.user = null;
	next();
})
router.use('/maps', require('./maps'));
router.use('/totals', require('./totals'));
router.use('/auth', require('./auth'));
router.use('/verify', require('./verify'));

module.exports = router;
