const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus();

const routes = require('./controllers');

const PORT = process.env.PORT || 5000;

// Master process is started from the command line
if (cluster.isMaster) {
  numCPUs.forEach(() => cluster.fork());
  console.log('Server running...');
} else {
  const app = express();

  // Priority serve any static files
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app.use(routes);

  // All remaining requests return the React app, so it can handle routing
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  app.listen(PORT);
}
