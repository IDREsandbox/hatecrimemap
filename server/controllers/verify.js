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


router.get('/unreviewedcount', (req, res) => {
  db.one(`SELECT COUNT(*) FROM incident i where i.verified = false`)
    .then((counts) => {
      res.status(200)
        .json({
          status: 'success',
          counts: counts.count
        })
    })
})

router.get('/unreviewed/:per/:page/:sortby', (req, res) => {
  let sortby = req.params.sortby;
  let query;
  if (sortby == 0) {
    query = `SELECT * FROM paginate_by_offset($1, $2)`
  }
  else if (sortby % 2 == 0) {
    query = `SELECT * FROM paginate_by_offset_desc($1, $2, $3)`
  } else {
    query = `SELECT * FROM paginate_by_offset_asc($1, $2, $3)`
  }

  db.any(query, [req.params.page, req.params.per, sortby]) // in case of first query 3rd param not used
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

router.post('/reviewedincident', (req, res) => {
  const { id, verified } = req.body;

  let query = `UPDATE incident SET verified = $1 WHERE id = ANY('{${generateIdString(id)}}')`;

  db.none(query, [verified])
    .then(() => res.send('Incident report reviewed'))
    .catch(err => console.log('ERROR:', err));
});

router.post('/validateincident', (req, res) => {
  const { id, urlvalid } = req.body;

  let query = `UPDATE incident SET issourceurlvalid = $1 WHERE id = ANY('{${generateIdString(id)}}')`;

  db.none(query, [urlvalid])
    .then(() => res.send('Incident url validated'))
    .catch(err => console.log('ERROR:', err));
});

router.post('/publishedincident', (req, res) => {
  const { id, published } = req.body;
 
  let query = `UPDATE incident SET published = $1 WHERE id = ANY('{${generateIdString(id)}}')`;
 
  db.none(query, [published])
    .then(() => res.send('Incident report marked published'))
    .catch(err => console.log('ERROR:', err));
});

// adding a function router/verify/incidentreport here, called in utilities.js and from verifyincidentspage


router.delete('/incidentreport/:id', (req, res) => {
  db.tx(db => {
    const del1 = db.result('DELETE FROM incident_groups where incident_id = $1', [req.params.id]);
    const del2 = db.result('DELETE FROM incident where id = $1', [req.params.id]);

    return db.batch([del1, del2]);
  }).then(response => res.status(200).send('deleted'))
    .catch(err => console.log('ERROR:', err))
});

const generateIdString = (id) => {
  let idString = ''
  if (id.length > 1) {
    let length = id.length
    id.forEach((each, index) => {
      if (index !== length - 1) {
        idString += each;
        idString += ', '
      }
      else {
        idString += each;
      }
    })
    console.log(idString)
    return idString;
  } else {
    return id
  }
}


module.exports = router;