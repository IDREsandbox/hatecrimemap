const express = require('express');
const PQ = require('pg-promise').ParameterizedQuery;

const db = require('../models');
const {
  checkLoginInfo,
} = require('../utilities');

const router = express.Router();
const columns = 'date, datesubmitted, lon, lat, reporttype, locationname, verified, id, sourceurl, groupsharassed, validsourceurl';
const findPointsInUS = `SELECT ${columns} FROM hcmdata WHERE (lon < -66.796875 AND lon > -124.5849609375) AND (lat < 49.00905080938215 AND lat > 25.125392611512158)`;
const findUnreviewedPoints = `SELECT ${columns} FROM hcmdata WHERE verified = -1`;

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home route');
});

router.get('/usapoints', (req, res) => {
  db.any(findPointsInUS)
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
        });
    })
    .catch(err => console.log('ERROR:', err));
});

router.get('/unreviewedpoints', (req, res) => {
  const { email, password, loggedIn } = req.query;
  if (loggedIn === 'false' && !checkLoginInfo(email, password)) {
    res.status(403).send('unauthorized');
    return;
  }

  db.any(findUnreviewedPoints)
    .then((mapdata) => {
      res.status(200)
        .json({
          status: 'success',
          mapdata,
        });
    })
    .catch(err => console.log('ERROR:', err));
});

router.post('/reviewedincident', (req, res) => {
  const updateUnreviewedIncident = new PQ('UPDATE hcmdata SET verified = $2 WHERE id = $1', Object.values(req.body));

  db.none(updateUnreviewedIncident)
    .then(() => res.send('Incident report reviewed'))
    .catch(err => console.log('ERROR:', err));
});

router.post('/incidentreport', (req, res) => {
  const addUnreviewedIncident = new PQ('INSERT INTO hcmdata(date, datesubmitted, groupsharassed, lat, locationname, lon, sourceurl, validsourceurl, verified, reviewedbystudent, reporttype) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', Object.values(req.body));

  db.none(addUnreviewedIncident)
    .then(() => res.send('Incident report added'))
    .catch(err => console.log('ERROR:', err));
});

router.delete('/incidentreport', (req, res) => {
  const deleteUnreviewedIncident = new PQ('DELETE FROM hcmdata WHERE id = $1', Object.values(req.body));

  db.result(deleteUnreviewedIncident)
    .then(() => res.send('Incident report deleted'))
    .catch(err => console.log('ERROR:', err));
});

module.exports = router;
