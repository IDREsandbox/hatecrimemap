const createInsertUnreviewedPointQuery = (data) => {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data).map((value) => {
    if (typeof value === 'string') return `\'${value}\'`; // eslint-disable-line
    if (value instanceof Date) return `(\'${value.toUTCString()}\')::date`; // eslint-disable-line
    return value;
  }).join(', ');
  const insertUnconfirmedPoint = `INSERT INTO hcmdata (${columns}) VALUES(${values})`;
  return insertUnconfirmedPoint;
};

module.exports = createInsertUnreviewedPointQuery;
