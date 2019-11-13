const express = require('express');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');
const {
	checkLoginInfo,
} = require('../utilities');

const router = express.Router();

/*
state_total integer,	// should be just "total" to be consistent with county
jewish integer,
african_american integer,
arab integer,
asian_american integer,
disabled integer,
latinx integer,
lgbtq integer,
muslim integer,
native_american integer,
pacific_islander integer,
sikh integer,
male integer,
female integer,
nonbinary integer,
white integer,
immigrants integer,
trump_supporter integer,
others integer
*/

const totals_columns = ["sum_harassment", "jewish_harassed_total", "african_american_harassed_total", "arab_harassed_total",
						"asian_american_harassed_total", "disabled_harassed_total", "latinx_harassed_total",
						"lgbt_harassed_total", "muslim_harassed_total", "native_american_harassed_total",
						"pacific_islander_harassed_total", "sikh_harassed_total", "women_harassed_total", "men_harassed_total", 
						"girls_harassed_total", "boys_harassed_total", "white_harassed_total", "immigrants_harassed_total",
						"trump_supporter_harassed_total", "others_harassed_total"];
const totals_match_pattern = ['%jewish%', '%african american%', '%arab%', '%asian american%', '%disabled%', '%latinx%', '%lgbt%',
								'%muslim%', '%native american%', '%pacific islander%', '%sikh%', '%male%', '%female%', '%nonbinary%',
								'%white%', '%immigrants%', '%trump supporter%', '%others%'];
const columns = ["jewish", "african_american", "arab", "asian_american", "disabled", "latinx", "lgbtq", "muslim", "native_american",
					"pacific_islander", "sikh", "male", "female", "nonbinary", "white", "immigrants", "trump_supporter", "others"]
const state_table_name = 'us_states';
const county_table_name = 'us_counties';
const state_totals_table_name = 'us_states';	// move to own table
const county_totals_table_name = 'us_counties';
const data_table_name = 'hcmdata';

// TODO, camel+lowercase all columns
const updateState = `update ${state_totals_table_name} set
					state_total = (SELECT count(*) FROM ${data_table_name} as data_table where ST_Intersects(${state_table_name}.geom, ST_SetSRID(ST_MakePoint(data_table.lon, data_table.lat), 4326))),
					${columns.map( (column_name, i) => {
						return (column_name + "= (SELECT count(*) FROM " + data_table_name + " as data_table where data_table.groupsharassed ilike '" + totals_match_pattern[i]
											+ "' and ST_Intersects(" + state_table_name + ".geom, ST_SetSRID(ST_MakePoint(data_table.lon, data_table.lat), 4326)))")
					}).join()};
`;

const updateCounty = `update ${county_totals_table_name} set
					${totals_columns.map( (column_name, i) => {
						return (column_name + "= (SELECT count(*) FROM " + data_table_name + " as data_table where data_table.groupsharassed ilike '" + totals_match_pattern[i]
											+ "' and ST_Intersects(" + county_table_name + ".geom, ST_SetSRID(ST_MakePoint(data_table.lon, data_table.lat), 4326))),")
					})}`;
					

const groups_harassed_column = 'groupsharassed';
// TODO move to globals/resources, as a better data structure
const race_ethnicity = ["'Jewish'", "'African American'", "'Arab'", "'Armenian'", "'Asian American'", "'Latinx'", "'Native American/Indigenous'", "'Pacific Islander'",
						"'Chinese'", "'Japanese American'", "'White'"];
const religion = ["'Muslim'", "'Sikh'"];
const gender = ["'Male'", "'Female'", "'Non-Binary'", "'LGBTQ'"];
const categorizeHarassed = `UPDATE ${data_table_name} SET
							race_ethnicity = array_intersect(groups, (ARRAY[${race_ethnicity.join()}])),
							religion = array_intersect(groups, (ARRAY[${religion.join()}])),
							gender = array_intersect(groups, (ARRAY[${gender.join()}])),
							other = array_diff(groups, (ARRAY[${race_ethnicity.join() + ',' + religion.join() + ',' + gender.join()}]))
							FROM (SELECT string_to_array("${groups_harassed_column}", ',') as groups, id FROM ${data_table_name}) as subquery
							WHERE subquery.id = ${data_table_name}.id`

// CREATE FUNCTION array_intersect(anyarray, anyarray)
//   RETURNS anyarray
//   language sql
// as $FUNCTION$
//     SELECT ARRAY(
//         SELECT UNNEST($1)
//         INTERSECT
//         SELECT UNNEST($2)
//     );
// $FUNCTION$;

// CREATE FUNCTION array_diff(anyarray, anyarray)
// 	RETURNS anyarray
// 	language sql
// as $FUNCTION$
// 	SELECT ARRAY(
// 		SELECT UNNEST($1)
// 		EXCEPT
// 		SELECT UNNEST($2)
// 	);
// $FUNCTION$;

// UPDATE hcmdata SET
// race_ethnicity =  array_intersect(groups, ARRAY['Jewish', 'African American', 'Arab', 'Armenian', 'Asian American', 'Latinx', 'Native American/Indigenous', 'Pacific Islander',
// 'Chinese', 'Japanese American', 'White']),
// religion =  array_intersect(groups, ARRAY['Muslim', 'Sikh']),
// gender =  array_intersect(groups, ARRAY['Male', 'Female', 'Non-Binary', 'LGBTQ'])
// FROM (SELECT string_to_array("groupsharassed", ',') as groups, id FROM hcmdata) as subquery
// WHERE subquery.id = hcmdata.id

router.use((req, res, next) => {
	/* queries to /totals api go through here first */
	next();
});

router.get('/', (req, res) => {
	db.any(`select ${columns}, name, state_total from ${state_totals_table_name} order by name asc`)
	.then((result) => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

router.get('/categorize', (req, res) => {
	db.any(categorizeHarassed)
	.then((result) => {
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
	db.one(updateState)
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
	db.one(updateState + " WHERE us_states.name ilike '%" + req.params.state + "%'")
	.then(result => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

router.get('/category/:category', (req, res) => {
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

module.exports = router;