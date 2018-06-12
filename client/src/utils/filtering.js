import ghFilters from '../globals/ghFilters';
import { arrToObject, camelize } from './utilities';

const filteringOptions = arrToObject(ghFilters);
filteringOptions.verified = {
  color: 'red',
};
let allpoints = [];

export function getAllPoints() {
  return allpoints.slice();
}

export function addGroupsHarassedSplit(mapdata) {
  const mapdataWithGroupsSplit = mapdata.map((point) => {
    const groupharassedsplit = point.groupharassedcleaned.split(',');
    return Object.assign({ groupharassedsplit }, point);
  });
  return mapdataWithGroupsSplit.slice();
}

export function storeMapData(mapdata) {
  const mapdataWithGroupsSplit = addGroupsHarassedSplit(mapdata);
  allpoints = mapdataWithGroupsSplit.slice();
  return mapdataWithGroupsSplit.slice();
}

export function updateCurrentLayers(layerName, prevLayers) {
  const currentLayers = new Set(prevLayers);

  if (currentLayers.has(layerName)) {
    currentLayers.delete(layerName);
  } else {
    currentLayers.add(layerName);
  }
  return currentLayers;
}

function arrayIncludesAllItems(arr, items) {
  let includesAll = true;
  items.forEach((item) => {
    if (!arr.includes(item)) includesAll = false;
  });
  return includesAll;
}

function addColor(mapdata, currentLayers) {
  let mapdataWithColor;
  // const { size } = currentLayers;
  // const sizeWithoutVerified = (currentLayers.has('verified')) ? size - 1 : size;
  if (currentLayers.size >= 2) {
    mapdataWithColor = mapdata.map(point => Object.assign({ color: '#000000' }, point));
  } else {
    const currentLayer = currentLayers.values().next().value;
    const { color } = filteringOptions[currentLayer];
    mapdataWithColor = mapdata.map(point => Object.assign({ color }, point));
  }
  return mapdataWithColor;
}

export function getMapData(layerName, prevLayers) {
  const currentLayers = new Set(prevLayers);
  if (currentLayers.size === 0) {
    return allpoints;
  }
  const mapdata = allpoints.slice();
  const filteredData = mapdata.filter(({ groupharassedsplit, verified }) => {
    const camelized = groupharassedsplit.map(groupName => camelize(groupName));
    if (verified > 0) {
      camelized.push('verified');
    }
    return arrayIncludesAllItems(camelized, Array.from(currentLayers));
  });
  const mapdataWithColor = addColor(filteredData, currentLayers);
  return mapdataWithColor.slice();
}

