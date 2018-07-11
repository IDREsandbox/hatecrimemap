const axios = require('axios');

const url = 'https://www.dailyemerald.com/2018/05/02/not-in-our-town-eugene-community-pushes-back-against-recent-hate-crime/';
const archiveUrl = `http://web.archive.org/save/${url}`;

const getRedirUrl = async () => {
  try {
    const res = await axios(archiveUrl);
    let redirUrl;
    res.data.split(' ').forEach((item) => {
      if (item.includes(url) && item.includes('/web/')) {
        redirUrl = item;
      }
    });
    return redirUrl;
  } catch (err) {
    console.log(err);
    return '';
  }
};

const waybackMachine = async () => {
  const redirUrl = await getRedirUrl();
  if (redirUrl === '') {
    return;
  }
};


// axios.post(`http://web.archive.org/save/${url}`)
//   .then((res) => {
//     const split = res.data.split(' ');
//     split.forEach((item) => {
//       if (item.includes(url) && item.includes('/web/')) {
//         console.log(item);
//       }
//     });
//   })
//   .catch(err => console.log(err));

module.exports = waybackMachine;
