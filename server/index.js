const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const { api, getmapdata } = require('./queries');

const PORT = process.env.PORT || 5000;

// Master process is started from the command line
if (cluster.isMaster) {
  console.log('Server running...');

  // Create worker for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });
} else {
  const app = express();

  // Priority serve any static files
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app.get('/api', api);
  app.get('/api/mapdata', getmapdata);

  // All remaining requests return the React app, so it can handle routing
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  app.listen(PORT);
}
