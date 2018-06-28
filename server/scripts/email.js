const nodemailer = require('nodemailer');

const db = require('../models');

const countUnreviewedQuery = 'SELECT COUNT(verified) FROM hcmdata WHERE verified = -1';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hatemapucla@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
  },
});

function sendEmail() {
  db.one(countUnreviewedQuery)
    .then(({ count }) => {
      const mailOptions = {
        from: 'hatemapucla@email.com',
        to: 'albertkun@idre.ucla.edu',
        subject: `${count} unreviewed incident reports!`,
        html: 'Click <a href="http://www.hatecrimemap.com/verifyincidents" target="_blank">here</a> to review them. (but not really cause production is not up to date)',
      };
      transporter.sendMail(mailOptions);
    })
    .catch(err => console.log('ERROR:', err));
}

module.exports = {
  sendEmail,
};
