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
  const gh = mapdata.map(group => group.groupharassedcleaned);
  const ghDelimited = gh
    .map(group => group.split(','))
    .reduce((acc, val) => acc.concat(val), []);
  const noDupes = Array.from(new Set(ghDelimited));
  console.log(noDupes);
}
/* eslint-enable */

export function createGroupHarassedCleaned(groupsHarassed) {
  const groupharassedcleaned = [];
  groupsHarassed.forEach((group) => {
    ghFilters.forEach((filter) => {
      if (filter.name === group) groupharassedcleaned.push(filter.label);
    });
  });
  return groupharassedcleaned.join(',');
}

export function createDataToSubmit(formData) {
  const { groupsHarassed, location, date, latLng, sourceurl, associatedLink } = formData;
  const groupharassedcleaned = createGroupHarassedCleaned(groupsHarassed);
  return Object.assign({}, {
    locationname: location,
    verified: -1,
    date,
    datesubmitted: new Date(),
    groupharassedcleaned,
    lat: latLng.lat,
    lon: latLng.lng,
    sourceurl,
    validsourceurl: associatedLink,
  });
}
