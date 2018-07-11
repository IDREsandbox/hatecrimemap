import axios from 'axios';

import ghFilters from '../globals/ghFilters';

export function arrToObject(arr) {
  const obj = arr.reduce((acc, elem) => {
    acc[elem.name] = Object.assign({}, elem);
    return acc;
  }, {});
  return obj;
}

/* eslint-disable */
export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function printUnique(mapdata) {
  const gh = mapdata.map(group => group.groupsharassed);
  const ghDelimited = gh
    .map(group => group.split(','))
    .reduce((acc, val) => acc.concat(val), []);
  const noDupes = Array.from(new Set(ghDelimited));
  console.log(noDupes);
}
/* eslint-enable */

export function createGroupsHarassed(groupsHarassed) {
  const groupsharassed = [];
  groupsHarassed.forEach((group) => {
    ghFilters.forEach((filter) => {
      if (filter.name === group) groupsharassed.push(filter.label);
    });
  });
  return groupsharassed.join(',');
}

export function createDataToSubmit(formData) {
  const { groupsHarassed, location, date, latLng, sourceurl, associatedLink } = formData;
  const groupsharassed = createGroupsHarassed(groupsHarassed);
  return Object.assign({}, {
    date: date.toUTCString(),
    datesubmitted: (new Date()).toUTCString(),
    groupsharassed,
    lat: latLng.lat,
    locationname: location,
    lon: latLng.lng,
    sourceurl,
    validsourceurl: associatedLink,
    verified: -1,
    reviewedbystudent: true,
    reporttype: 'Harassment/Attack',
  });
}

export const reviewIncidentReport = (id, verified, callback = null) => () => {
  axios.post('/api/maps/reviewedincident', { id, verified })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  callback();
};

export const deleteIncidentReport = (id, callback = null) => () => {
  axios.delete('/api/maps/incidentreport', { data: { id } })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  callback();
};

export const addRowNumProperty = (data) => {
  data.forEach((point, i) => {
    point.rowNum = i;
    const camelized = point.groupsharassedsplit.map(group => camelize(group));
    point.camelized = new Set(camelized);
  });
};

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};

const getCookie = (cname) => {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const checkLoggedInCookie = () => {
  const loggedIn = getCookie('loggedIn');
  return loggedIn !== '';
};
