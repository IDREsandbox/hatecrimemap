const nodemailer = require('nodemailer');
const { CronJob } = require('cron');

const db = require('../models');

const countUnreviewedPoints = 'SELECT COUNT(verified) FROM hcmdata WHERE verified = -1';
const gmailAddress = process.env.GMAIL_ADDRESS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailAddress,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const onTick = () => {
  db.one(countUnreviewedPoints)
    .then(({ count }) => {
      if (Number(count) < 1) {
        return;
      }
      const mailOptions = {
        from: gmailAddress,
        to: gmailAddress,
        subject: `${count} unreviewed incident reports!`,
        html: 'You have 9 reports that need to be reviewed. Click <a href="http://www.hatecrimemap.com/verifyincidents" target="_blank">here</a> to review them.',
      };
      transporter.sendMail(mailOptions);
    })
    .catch(err => console.log('ERROR:', err));
};

const unreviewedPointsEmailJob = new CronJob({
  cronTime: '0 0 0 * * 0',
  onTick,
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = unreviewedPointsEmailJob;
