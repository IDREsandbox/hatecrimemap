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
