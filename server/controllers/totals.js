const express = require('express');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');
const {
	checkLoginInfo,
} = require('../utilities');

const router = express.Router();

const columns = 'name, sum_harassment, jewish_harassed_total';
const updateState = `
update us_states set sum_harassment = (select count(*) from hcmdata where ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
jewish_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%jewish%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
african_american_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%african american%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
arab_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%arab%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
asian_american_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%jewish%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
disabled_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%disabled%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
latinx_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%latinx%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
lgbt_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%lgbt%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
muslim_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%muslim%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
native_american_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%native american%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
pacific_islander_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%pacific islander%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
sikh_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%sikh%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
women_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%women%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
men_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%men%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
girls_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%girls%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
boys_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%boys%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
white_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%white%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
immigrants_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%immigrants%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
trump_supporter_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%trump supporter%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
others_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%others%' and ST_Intersects(us_states.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326)))
`;

const updateCounty = `
update us_counties set sum_harassment = (select count(*) from hcmdata where ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
jewish_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%jewish%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
african_american_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%african american%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
arab_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%arab%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
asian_american_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%jewish%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
disabled_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%disabled%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
latinx_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%latinx%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
lgbt_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%lgbt%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
muslim_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%muslim%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
native_american_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%native american%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
pacific_islander_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%pacific islander%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
sikh_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%sikh%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
women_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%women%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
men_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%men%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
girls_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%girls%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
boys_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%boys%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
white_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%white%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
immigrants_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%immigrants%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
trump_supporter_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%trump supporter%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326))),
others_harassed_total = (select count(*) from hcmdata where groupsharassed ilike '%others%' and ST_Intersects(us_counties.geom, ST_SetSRID(ST_MakePoint(hcmdata.lon, hcmdata.lat), 4326)))
`

router.use((req, res, next) => {
	/* queries to /totals api go through here first */
	next();
});

router.get('/', (req, res) => {
	db.any(`select ${columns} from us_states order by name asc`)
	.then((result) => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

router.get('/:category', (req, res) => {
	db.any(`select ${req.params.category + '_harassed_total, sum_harassment, name'} from us_states order by name asc`)
	.then(result => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

router.get('/update', (req, res) => {
	res.write('Updating totals...');
	db.one(updateAll)
	.then((result) => {
		res.status(200)
		.json({
			status: 'success',
			mapdata,
		});
	})
	.catch(err => console.log('ERROR:', err));
});

router.get('/update/:state', (req, res) => {
	db.one(updateAll + " WHERE us_states.name ilike '%" + req.params.state + "%'")
	.then(result => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});


module.exports = router;