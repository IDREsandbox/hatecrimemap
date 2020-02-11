const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');

const routes = require('./controllers');
const startJobs = require('./jobs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

// Priority serve any static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	store: new (require('connect-pg-simple')(session))({
		conString: 'postgres://wijhpidbhbgnez:58a7cbbf8ea368029c7c9f63aea3caddb900eb6a357e572830cb7ab456c06c2a@ec2-54-235-156-60.compute-1.amazonaws.com:5432/de1of4ov5iao3o?ssl=true'
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
