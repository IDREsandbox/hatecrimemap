const express = require('express');
const PG = require('pg-promise')();
const PQ = PG.ParameterizedQuery;

const db = require('../models');
const router = express.Router();

const session = require('express-session');

router.get('/check', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  res.send({auth: loggedIn });
})

router.post('/login', (req, res) => {
  const { useremail, password } = req.body;
  // TODO: crypt() call should be done at this point, not on the DB (password will be sent in plaintext), but the secret is on the DB?
  db.oneOrNone(`SELECT * FROM auth_user($1::varchar, $2::varchar)`, [useremail, password])
  .then((user) => {
      if(user.auth_user) {
        req.session.user = { useremail: useremail, password: password };
      }
      res.status(200).json(user);  // Document possible responses to the client
    })
  .catch(err => console.log('ERROR: ', err));
});

router.post('/logout', (req, res) => {
  const user = req.session.user;
  if (user) {
    req.session.destroy(err => {
        if (err) throw (err);
        res.clearCookie('connect.sid');
        res.send('Logged out');
      });
  } else {
    res.send('Not logged in');
  }
})

router.post('/signup', (req, res) => {
  const { username, email, password, name } = req.body;
  db.oneOrNone(`SELECT * FROM insert_user($1::varchar, $2::varchar, $3::varchar, $4::varchar)`, [username, email, password, name])
  .then((user) => {
      res.status(200).json(user);  // Document possible responses to the client
    })
  .catch(err => console.log('ERROR: ', err));
});

module.exports = router;