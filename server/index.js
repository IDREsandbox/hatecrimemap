require('dotenv').config()

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');

const routes = require('./controllers');
const startJobs = require('./jobs');

const app = express();
const PORT = process.env.PORT || 5000;

// 'DEPTH_ZERO_SELF_SIGNED_CERT' Error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

app.use(helmet());

// Priority serve any static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	store: new (require('connect-pg-simple')(session))({
		conString: process.env.DB_STRING
	}),
	secret: 'dumb',
	resave: false,
	saveUninitialized: false, // force save to the store. A session is uninitialized when it is new but not modified. 
	cookie: {maxAge: 24*60*60*1000}	// 24 hours (1 day)
}));

app.use('/api', routes);

// All remaining requests return the React app, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT);

startJobs();
