const checkValidUrlsJob = require('./checkValidUrlsJob');
const unreviewedPointsEmailJob = require('./unreviewedPointsEmailJob');
const waybackMachine = require('./waybackMachineJob');

const startJobs = () => {
  checkValidUrlsJob.start();
  unreviewedPointsEmailJob.start();
  waybackMachine();
};

module.exports = startJobs;
