const validSourceURLQuery = '';

function insertvalidsourceurl() {
  db.none(validSourceURLQuery)
    .then(() => console.log('success'))
    .catch(err => console.log('ERROR:', err));
}

