const express = require('express');
const path = require('path');

const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use('/api', routes);

// All remaining requests return the React app, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT);
