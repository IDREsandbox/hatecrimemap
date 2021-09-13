const express = require('express');
const PG = require('pg-promise')();

const db = require('../models');
const {
    checkLoginInfo,
} = require('../utilities');

const router = express.Router();


const storiesQuery = `select us.name as state, us.id, (uc.name||','||uc.statefp) as county, published, extract(year from incidentdate) as yyyy, i.description
from incident i -- include all groups, even if aggregate of one is 0
join us_states us on us.id = i.state_id -- attach the state name
join us_counties uc on uc.id = i.county_id -- attach the county name
where incidentdate IS NOT NULL AND incidentdate < now()::date and us.name = 'California'`


router.post('/stories/:state', (req, res) => {

    let query = storiesQuery;

    if (req.params.state) {
        query += ` and us.name = ${req.params.state}`;
    }
    db.any(query)
        .then(res => console.log(res))
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;