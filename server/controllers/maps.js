const express = require('express');

const db = require('../models');
const {
  createInsertUnreviewedPointQuery,
  createDeleteIncidentReportQuery,
  createPostReviewedIncidentQuery,
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
  const postReviewedIncidentQuery = createPostReviewedIncidentQuery(req.body);

  db.none(postReviewedIncidentQuery)
    .then(() => res.send('Incident report reviewed'))
    .catch(err => console.log('ERROR:', err));
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
