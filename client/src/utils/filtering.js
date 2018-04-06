import ghFilters from './ghFilters';
import { removeDuplicates, arrToObject } from './utilities';

const filteringOptions = arrToObject(ghFilters);
const currentLayers = new Set();
const storedLayers = {};

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
