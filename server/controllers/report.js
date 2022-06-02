const express = require('express');
const PG = require('pg-promise')();

const db = require('../models');
const {
  checkLoginInfo,
} = require('../utilities');

const router = express.Router();

router.post('/incident', (req, res) => { 
  const {lat, lon, location, incidentdate, sourceurl, primaryGroup, groups,
    other_race, other_religion, other_gender, other_misc, description, tag } = req.body;
  db.oneOrNone(`SELECT * FROM
    insert_incident($1::double precision, $2::double precision, $3::varchar, $4::date,
    $5::varchar, $6::integer, $7::int[], $8::varchar, $9::varchar, $10::varchar, $11::varchar, $12::text, $13::int)`,
    [lat, lon, location, new Date(incidentdate), sourceurl, primaryGroup, groups,
    other_race, other_religion, other_gender, other_misc, description, tag])
  .then(id => {
    if (id.insert_incident){
      res.status(200).send('Incident inputted');
    }
    else
      res.status(500).send('Could not insert incident');
  })
  .catch(err => {
    console.log(err);
    res.status(500).send();
  });
});

module.exports = router;
