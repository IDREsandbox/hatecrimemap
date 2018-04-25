import ghFilters from '../globals/ghFilters';
import { arrToObject } from './utilities';

const filteringOptions = arrToObject(ghFilters);
const currentLayers = new Set();
export const storedLayers = {};

export function storeMapData(name, mapdata) {
  if (!storedLayers[name]) {
    storedLayers[name] = mapdata;
  }
}

function updateCurrentLayers(layerName) {
  if (currentLayers.has(layerName)) {
    currentLayers.delete(layerName);
  } else {
    currentLayers.add(layerName);
  }
}

function addColor(mapdata) {
  let mapdataWithColor;
  if (currentLayers.size >= 2) {
    mapdataWithColor = mapdata.map(point => Object.assign({ color: '#000000' }, point));
  } else {
    const currentLayer = currentLayers.values().next().value;
    const { color } = filteringOptions[currentLayer];
    mapdataWithColor = mapdata.map(point => Object.assign({ color }, point));
  }
  return mapdataWithColor;
}

export function getMapData(layerName) {
  updateCurrentLayers(layerName);
  if (currentLayers.size === 0) {
    return storedLayers.allpoints;
  }
  let mapdata = storedLayers.allpoints;
  currentLayers.forEach((layer) => {
    const { customFilter } = filteringOptions[layer];
    const filteredData = mapdata.filter(point => customFilter(point));
    mapdata = filteredData;
  });
  const mapdataWithColor = addColor(mapdata);
  return mapdataWithColor;
}

export function addGroupHarassedSplit(mapdata) {
  const mapdataWithGroupsSplit = mapdata.map((point) => {
    const groupharassedsplit = point.groupharassedcleaned.split(',');
    return Object.assign({ groupharassedsplit }, point);
  });
  return mapdataWithGroupsSplit;
}
