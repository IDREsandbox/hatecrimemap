const checkLoginInfo = (email, password) => (
  email === process.env.GMAIL_ADDRESS && password === process.env.GMAIL_PASSWORD
);

module.exports = {
  checkLoginInfo,
};
