import axios from 'axios';
import React from 'react';

export function createDataToSubmit(formData) { // NEEDED
  const { targetCategory, groups, primaryGroup, groupsChecked, groupsExpanded,
          latLng, location, sourceurl, other_race, other_religion, other_gender, other_misc,
          date, description } = formData;
  return ({
    lat: latLng.lat,
    lon: latLng.lng,
    location: location,
    incidentdate: date,
    sourceurl: sourceurl,
    primaryGroup: primaryGroup,
    groups: groupsChecked,
    other_race: other_race,
    other_religion: other_religion,
    other_gender: other_gender,
    other_misc: other_misc,
    description: description
  });
}

export const reviewIncidentReport = (id, verified, callback = null) => () => {
  axios.post('/api/verify/reviewedincident', { id, verified })
    .then(res => {
      console.log(res.data)
      callback();
      window.location.reload();
    })
    .catch(err => console.log(err));
};

export const validateIncidentReport = (id, urlvalid, callback = null) => () => {
  axios.post('/api/verify/validateincident', { id, urlvalid })
    .then(res => {
      console.log(res.data)
      callback();
      window.location.reload();
    })
    .catch(err => console.log(err));
};

export const publishedIncidentReport = (id, published, callback = null) => () => {
  axios.post('/api/verify/publishedincident', { id, published })
    .then(res => {
      console.log(res.data)
      callback();
      window.location.reload();
    })
    .catch(err => console.log(err));
};

export const deleteIncidentReport = (id, callback = null) => () => {
  console.log(id);
  axios.delete(`/api/verify/incidentreport/${id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  callback();
  window.location.reload();
};
