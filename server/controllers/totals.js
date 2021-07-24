const express = require('express');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');
const {
	checkLoginInfo,
} = require('../utilities');

const router = express.Router();

router.use((req, res, next) => {
	/* queries to /totals api go through here first */
	next();
});

const covidQuery = `SELECT "ID", to_char("Date_Incident", 'MM/DD/YY') as date, "Gender" as gender, "City_Updated" as city, "State_Updated" as state, "Ethnicity_Cleaned" as ethnicity, "Type_Discrimination_Cleaned" as type, "Reason_Discrimination_Cleaned", "Description" as description, "Any_SupportingLinks" as link
							FROM aapi_covid_data
							WHERE ("State_Updated" <> 'OTHER' OR ("State_Updated" = 'Other' AND "City_Updated" <> 'Online')) AND "Flag_Troll" = 'false' AND "Date_Incident" > '1/1/2020'::date AND "Date_Incident" < now()::date
							ORDER BY "Date_Incident"`

router.get('/covid', (req, res) => {
	db.any(covidQuery)
	.then(result => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
})

function formatGroups(results) {
	var ret = [];
	var parent = [];
	var prev = null;

	for(var i = 0; i < results.length; i++) {
		const currentItem = { name: results[i].name, key: results[i].id , level: results[i].level, children: []};

		for(var k=parent.length;k>currentItem.level;k--){
			parent.pop();
		}

		if(currentItem.level == 0){
			ret.push(currentItem);
		}
		else if(currentItem.level > prev.level){
			parent.push(prev);
			parent[parent.length-1].children.push(currentItem);
		}
		else{
			parent[parent.length-1].children.push(currentItem);
		}

		prev = currentItem;
	}
	return ret;
}

const groupsQuery = `WITH RECURSIVE groups_tree AS (
	SELECT id, name, "order", 0 AS level, cast("order" as varchar) AS path
	FROM groups WHERE parent_id is null

	UNION ALL
	
	SELECT g.id, g.name, g."order", level + 1, cast(gt.path || '.' || cast(g."order" as varchar) as varchar)
	FROM groups_tree gt
	INNER JOIN groups g ON (g.parent_id = gt.id)
)
SELECT * from groups_tree
ORDER BY path`

router.get('/groups', (req,res) => {
	db.any(groupsQuery)
	.then((result) => {
		const ret = formatGroups(result)
		res.status(200)
		.json({
			status: 'success',
			ret
		});
	})
	.catch(err => console.log('ERROR: ', err));
})

const allReports = `SELECT t.id, to_char(t.incidentdate, 'MM/DD/YY') as date, us_states.name as state, g2.name as parent, g1.name as group, t.published, t.sourceurl as link, t.description
					FROM (SELECT i.id, i.incidentdate, state_id, i.primary_group_id as parent, group_id, published, sourceurl, description
							FROM incident i
							JOIN incident_groups ON i.id = incident_id
					) t JOIN us_states ON us_states.id = t.state_id
						JOIN groups g1 ON g1.id = t.group_id
						JOIN groups g2 ON g2.id = t.parent
						ORDER by date
					`
router.get('/reports', (req, res) => {
	db.any(allReports)
	.then(result => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

// TODO: rename/does not belong here
// NOTE: removed the `WHERE clause g2.name ILIKE $1`, decide whether we want to constrain on the primary reason (parent_group), because the totals # currently does not
router.get('/filtered', (req, res) => {
	let query = `SELECT t.id, to_char(t.incidentdate, 'MM/DD/YY') as date, us_states.name as state, uc.county_state as county, g2.name as parent, g1.name as group, t.published, t.sourceurl as link, t.description
	FROM (SELECT i.id, i.incidentdate, state_id, county_id, i.primary_group_id as parent, group_id, published, sourceurl, description
			FROM incident i
			JOIN incident_groups ON i.id = incident_id
	) t JOIN us_states ON us_states.id = t.state_id
		join us_counties uc on uc.id = t.county_id
			JOIN groups g1 ON g1.id = t.group_id
			JOIN groups g2 ON g2.id = t.parent `;
	({
		group,
		state,
		published,
		lockItem,
		lockType
	} = req.query);
	
	if (lockItem == 'all') {
		if (published) {
			(`WHERE g1.name ILIKE $1 AND published=true`);
		} else {
			query += (`WHERE g1.name ILIKE $1`);
		}
	} else {
		if (lockType == 'state') {
			if (published) {
				(`WHERE g1.name ILIKE $1 AND published=true AND us_states.name ILIKE $2`);
			} else {
				query += (`WHERE g1.name ILIKE $1 AND us_states.name ILIKE $2`);
			}
		} else {
			if (published) {
				(`WHERE g1.name ILIKE $1 AND published=true AND us_states.name ILIKE $2`);
			} else {
				query += (`WHERE g1.name ILIKE $1 AND uc.county_state ILIKE $2`);
			}
		}
	}
	db.any(query, [group, lockItem])
		.then((result) => {
			res.status(200)
				.json({
					status: 'success',
					result
				});
		})
		.catch(err => console.log('ERROR: ', err));
});

const partitionedCounts =  `select us.name as state, (uc.name||','||uc.statefp) as county, g2.name as primary_reason, g.name as group, published, extract(year from incidentdate) as yyyy, COUNT(*)::int
							from groups g -- include all groups, even if aggregate of one is 0
							join incident_groups ig on g.id = ig.group_id -- attach the name to all reports
							join incident i on ig.incident_id = i.id
							join groups g2 on i.primary_group_id = g2.id -- attach parent group name. NOTE, ideally we could map 'group' to its primary, but some have a different primary than group
							join us_states us on us.id = i.state_id -- attach the state name
							join us_counties uc on uc.id = i.county_id -- attach the county name
							where incidentdate IS NOT NULL AND incidentdate < now()::date
							group by us.name, (uc.name||','||uc.statefp), g2.name, g.name, published, extract(year from incidentdate)`

router.get('/', (req, res) => {
	db.any(partitionedCounts)
	.then((result) => {
		res.status(200)
		.json({
			status: 'success',
			result
		});
	})
	.catch(err => console.log('ERROR: ', err));
});

module.exports = router;