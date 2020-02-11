const express = require('express');
const PG = require('pg-promise')();
const PQ = PG.ParameterizedQuery;

const db = require('../models');
const router = express.Router();
const session = require('express-session');

router.use('*', (req, res, next) => {
  const user = req.session.user;
  if (user) {
    next();
  } else {
    res.send('Not authorized');
  }
});

const columns = 'i.id, i.location, i.incidentdate, i.submittedon, i.sourceurl, i.waybackurl, i.othergroup, g.groupsharassed'
const findUnreviewedPoints = `SELECT ${columns}
                              FROM incident i
                              JOIN (
                                SELECT ig.incident_id AS id, array_agg(groups.name) AS groupsharassed
                                  FROM incident_groups ig
                                JOIN groups ON groups.id = ig.group_id
                                GROUP BY ig.incident_id
                              ) g USING (id)
                                WHERE i.verified = false AND i.issourceurlvalid = true
                                ORDER BY i.submittedon`

router.get('/unreviewedcount', (req, res) => {
  db.one('SELECT COUNT(*) FROM incident')
    .then((counts) => {
      res.status(200)
        .json({
          status: 'success',
          counts: counts.count
        })
    })
})

router.get('/unreviewed/:per/:page', (req, res) => {
  db.any(`SELECT * FROM paginate_by_offset(${req.params.page}, ${req.params.per})`)
    .then((incidents) => {
      res.status(200)
        .json({
          status: 'success',
          incidents
        })
    })
})

router.get('/unreviewed', (req, res) => {
  db.any(findUnreviewedPoints)
    .then((incidents) => {
      res.status(200)
        .json({
          status: 'success',
          incidents,
        });
    })
    .catch(err => console.log('ERROR:', err));
});

router.post('/reviewedincident', (req, res) => {
  const { id, verified } = req.body;
  const updateUnreviewedIncident = new PQ('UPDATE incident SET verified = $2 WHERE id = $1', [id, verified]);

  db.none(updateUnreviewedIncident)
    .then(() => res.send('Incident report reviewed'))
    .catch(err => console.log('ERROR:', err));
});

module.exports = router;