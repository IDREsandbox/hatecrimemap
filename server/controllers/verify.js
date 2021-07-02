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

const columns = 'i.id, i.location, i.incidentdate, i.submittedon, i.sourceurl, i.verified, i.issourceurlvalid, i.published, i.waybackurl, g.groupsharassed'
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

router.get('/unreviewedcount', (req, res) => { // to remove
  db.one('SELECT COUNT(*) FROM incident WHERE verified=FALSE and issourceurlvalid=TRUE')
    .then((counts) => {
      res.status(200)
        .json({
          status: 'success',
          counts: counts.count
        })
    })
})

router.get('/unreviewedcount/:verified', (req, res) => {
  db.one(`SELECT COUNT(*) FROM incident WHERE verified=any($1::boolean[])`, [req.params.verified]) // removed isurlvalidcheck
    .then((counts) => {
      res.status(200)
        .json({
          status: 'success',
          counts: counts.count
        })
    })
})

router.get('/unreviewed/:per/:page/:verified', (req, res) => {
  db.any(`SELECT * FROM paginate_by_offset($1, $2, $3::boolean[])`, [req.params.page, req.params.per, req.params.verified])
    .then((incidents) => {
      res.status(200)
        .json({
          status: 'success',
          incidents
        })
    }).catch(err =>
      console.log(err.message)
    )
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
  console.log(id);
  //const updateUnreviewedIncident = new PQ();

  db.none('UPDATE incident SET verified = $2 WHERE id = $1', [id, verified])
    .then(() => res.send('Incident report reviewed'))
    .catch(err => console.log('ERROR:', err));
});

router.post('/validateincident', (req, res) => {
  const { id, urlvalid } = req.body;
  //const updateUnreviewedIncident = new PQ();

  db.none('UPDATE incident SET issourceurlvalid = $2 WHERE id = $1', [id, urlvalid])
    .then(() => res.send('Incident url validated'))
    .catch(err => console.log('ERROR:', err));
});

router.post('/publishedincident', (req, res) => {
  const { id, published } = req.body;
  //const updateUnreviewedIncident = new PQ();

  db.none('UPDATE incident SET published = $2 WHERE id = $1', [id, published])
    .then(() => res.send('Incident report marked published'))
    .catch(err => console.log('ERROR:', err));
});


// adding a function router/verify/incidentreport here, called in utilities.js and from verifyincidentspage

router.delete('/incidentreport/:id', (req, res) => {
 
  db.tx(db => {
    const del1 = db.result('DELETE FROM incident_groups where incident_id = $1', [req.params.id]);
    const del2 =  db.result('DELETE FROM incident where id = $1', [req.params.id]);

    return db.batch([del1, del2]);
  }).then(response => res.status(200).send('deleted'))
    .catch(err => console.log('ERROR:', err))
});



module.exports = router;