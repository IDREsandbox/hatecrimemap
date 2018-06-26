const express = require('express');

const db = require('../models');
const { createInsertUnreviewedPointQuery, createDeleteIncidentReportQuery } = require('../utilities');

const router = express.Router();
const desiredColumns = 'date, datesubmitted, lon, lat, reporttype, locationname, verified, id, sourceurl, groupsharassed, validsourceurl';
const pointsInUSQuery = `SELECT ${desiredColumns} FROM hcmdata WHERE (lon < -66.796875 AND lon > -124.5849609375) AND (lat < 49.00905080938215 AND lat > 25.125392611512158)`;
const unreviewedPointsQuery = `SELECT ${desiredColumns} FROM hcmdata WHERE verified = -1`;
// `DELETE * FROM hcmdata WHERE id = ${}`

router.use((req, res, next) => {
  /* queries to /maps api go through here first */
  next();
});

router.get('/', (req, res) => {
  res.send('Maps home route');
});

router.get('/usapoints', (req, res) => {
  db.any(pointsInUSQuery)
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
  db.any(unreviewedPointsQuery)
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
  console.log(req.body);
  res.end('incident reviewed');
});

router.post('/incidentreport', (req, res) => {
  const insertUnreviewedPointQuery = createInsertUnreviewedPointQuery(req.body);

  db.none(insertUnreviewedPointQuery)
    .then(() => res.send('Incident report added'))
    .catch(err => console.log('ERROR:', err));
});

router.delete('/incidentreport', (req, res) => {
  const deleteIncidentReportQuery = createDeleteIncidentReportQuery(req.body.id);

  db.result(deleteIncidentReportQuery)
    .then(() => res.send('Incident report deleted'))
    .catch(err => console.log('ERROR:', err));
});

module.exports = router;
