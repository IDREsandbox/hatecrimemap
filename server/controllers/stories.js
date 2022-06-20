const { response } = require('express');
const express = require('express');
const PG = require('pg-promise')();

const db = require('../models');
const {
    checkLoginInfo,
} = require('../utilities');

const router = express.Router();

const storiesQuery = `select us.name as state, us.id, (uc.name||','||uc.statefp) as county, published, incidentdate as date, i.location, i.description, st_x(i.coord) as longitude, st_y(i.coord) as latitude
from incident i -- include all groups, even if aggregate of one is 0
join us_states us on us.id = i.state_id -- attach the state name
join us_counties uc on uc.id = i.county_id -- attach the county name
where incidentdate IS NOT NULL and st_x(i.coord) is not null AND st_y(i.coord) is not null and "location"  is not null
and us.name is not null and us.id is not null and uc.name is not null and uc.statefp is not null and incidentdate < now()::date`

// TODO - implement
const cleanupStory = (data) => {
    data.forEach(element => {
        for (let i = 0; i < element.length; i++) {
            if (element[i] === '�') {
                if (i > 0) {
                    let c = element[i - 1]
                    if (c.toLowerCase() != c.toUpperCase()) {
                        element[i] = '\'';
                    } else {
                        element[i] = '"';
                        ++i;
                        while (i < element.length && element[i] != '�');

                        if (i < element.length) {
                            element[i] == '"';
                        }
                    }
                }
            }
        }
    });
    return data;
}

const processStoryData = (response) => {
    let data = response.filter(each => {
        if (each.description && each.latitude && each.longitude) {
            return each.description !== '';
        } else {
            return false;
        }
    })
    if (data.length > 10) {
        return data.splice(0, 10);
    } else {
        return data
    }
}

router.get('/:type/:name', (req, res) => {
    let query = storiesQuery;

    if (req.params.type === 'state') {
        query += ` and us.name = '${req.params.name}'`;
    } else if (req.params.type === 'county') {
        query += ` and (uc.name||','||uc.statefp) = '${req.params.name}'`;
    }

    db.any(query)
        .then(result => {
            let data = processStoryData(result);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;