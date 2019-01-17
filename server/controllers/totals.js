const express = require('express');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');
const {
	checkLoginInfo,
} = require('../utilities');

const router = express.Router();

const columns = 'sum_harassment, jewish_harassed_total';
const updateFunc = `
update us_states set sum_harassment = (select count(*) from hcmdata where ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
jewish_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%jewish%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326)))
`;

const getTotals = `select ${columns} from us_states`;

router.use((req, res, next) => {
	/* queries to /totals api go through here first */
	next();
});

router.get('/', (req, res) => {
	db.any(getTotals)
	.then((result) => {
		res.status(200);
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

router.get('/update', (req, res) => {
	res.write('Updating totals...');
	db.one(updateFunc)
	.then((result) => {
		res.status(200);
		.json({
			status: 'success',
			mapdata,
		});
	})
	.catch(err => console.log('ERROR:', err));
});


module.exports = router;