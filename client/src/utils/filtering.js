import ghFilters from './ghFilters';

function arrToObject(arr) {
  const obj = arr.reduce((acc, elem) => {
    acc[elem.name] = elem;
    return acc;
  }, {});
  return obj;
}

const filteringOptions = arrToObject(ghFilters);
const currentLayers = new Set();
const storedLayers = {};

function removeDuplicates(arr) {
  const uniqueArray = [];
  const seen = new Set();
  for (let i = 0; i < arr.length; i++) {
    const { featureid } = arr[i];
    if (!seen.has(featureid)) {
      seen.add(featureid);
      uniqueArray.push(arr[i]);
    }
  }
  return uniqueArray;
}

export function storeMapData(name, mapdata) {
  if (!storedLayers[name]) {
    storedLayers[name] = mapdata;
  }
}

export function getMapData(name) {
  if (currentLayers.has(name)) {
    currentLayers.delete(name);
  } else {
    currentLayers.add(name);
  }
  if (currentLayers.size === 0) {
    return storedLayers.allpoints;
  }
  let mapdata = [];
  currentLayers.forEach((layer) => {
    const { customFilter, color } = filteringOptions[layer];
    const filteredData = storedLayers.allpoints
      .filter(point => customFilter(point))
      .map(point => Object.assign({ color }, point));
    mapdata = filteredData;
  });
  return removeDuplicates(mapdata);
}
