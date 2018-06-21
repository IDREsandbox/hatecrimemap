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
  });
}
