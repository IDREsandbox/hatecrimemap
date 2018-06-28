const createInsertUnreviewedPointQuery = (data) => {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data).map((value) => {
    if (typeof value === 'string') return `\'${value}\'`; // eslint-disable-line
    return value;
  }).join(', ');
  const insertUnconfirmedPoint = `INSERT INTO hcmdata (${columns}) VALUES(${values})`;
  return insertUnconfirmedPoint;
};

const createDeleteIncidentReportQuery = id => `DELETE FROM hcmdata WHERE id = ${id}`;

const createPostReviewedIncidentQuery = ({ id, verified }) => `UPDATE hcmdata SET verified = ${verified} WHERE id = ${id}`;

module.exports = {
  createInsertUnreviewedPointQuery,
  createDeleteIncidentReportQuery,
  createPostReviewedIncidentQuery,
};
