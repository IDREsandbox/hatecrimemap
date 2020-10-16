import ghFilters from '../globals/ghFilters';
import { arrToObject, camelize } from './utilities';

const filteringOptions = arrToObject(ghFilters);
filteringOptions.verified = {
  color: 'red',
};
filteringOptions.unverified = {
  color: 'green',
};
filteringOptions.all = {
  color: 'blue',
};

// export function getAllPoints() {
//   return allpoints.slice();
// }

export function addGroupsHarassedSplit(mapdata) {
  const mapdataWithGroupsSplit = mapdata.map((point) => {
    const groupsharassedsplit = point.groupsharassed.split(',');
    return Object.assign({ groupsharassedsplit }, point);
  });
  return mapdataWithGroupsSplit.slice();
}

// export function storeMapData(mapdata) {
//   const mapdataWithGroupsSplit = addGroupsHarassedSplit(mapdata); // 'groupsharassed' comma-separated to array
//   allpoints = mapdataWithGroupsSplit.slice(); // Make a copy
//   return mapdataWithGroupsSplit.slice();  // return a different copy
// }

function removePreviousShowReports(layers) {
  if (layers.has('verified')) layers.delete('verified');
  if (layers.has('unverified')) layers.delete('unverified');
  if (layers.has('all')) layers.delete('all');
}

export function updateCurrentLayers(layerName, prevLayers, updateShowReports = false) {
  const currentLayers = new Set(prevLayers);
  if (updateShowReports) removePreviousShowReports(currentLayers);

  if (currentLayers.has(layerName)) {
    currentLayers.delete(layerName);
  } else {
    currentLayers.add(layerName);
  }
  return currentLayers;
}

function arrayIncludesAllItems(arr, items) {
  let includesAll = true;
  items.forEach((item) => { // a for loop with breaking will probably be faster
    if (!arr.includes(item)) includesAll = false;
  });
  return includesAll;
}

function getColor(currentLayers) {
  let color;
  currentLayers.forEach((layer) => {
    if (layer !== 'verified' && layer !== 'unverified' && layer !== 'all') {
      color = filteringOptions[layer].color; // eslint-disable-line
    }
  });
  return color;
}

function addColor(mapdata, currentLayers) {
  let mapdataWithColor;
  const { size } = currentLayers;
  const sizeWithoutVerified = size - 1;
  if (sizeWithoutVerified >= 2) {
    mapdataWithColor = mapdata.map(point => Object.assign({ color: '#000000' }, point));
  } else {
    const color = getColor(currentLayers);
    mapdataWithColor = mapdata.map(point => Object.assign({ color }, point));
  }
  return mapdataWithColor;
}

// export function getMapData(layerName, prevLayers) {
//   const currentLayers = new Set(prevLayers);
//   if (currentLayers.size === 0) {
//     return allpoints;
//   }
//   const mapdata = allpoints.slice();
//   const filteredData = mapdata.filter(({ groupsharassedsplit, verified }) => {
//     const camelizedGroupNames = groupsharassedsplit.map(groupName => camelize(groupName));
//     camelizedGroupNames.push('all');
//     if (verified > 0) {
//       camelizedGroupNames.push('verified');
//     }
//     if (verified === 0) {
//       camelizedGroupNames.push('unverified');
//     }
//     return arrayIncludesAllItems(camelizedGroupNames, Array.from(currentLayers));
//   });
//   const mapdataWithColor = addColor(filteredData, currentLayers);
//   return mapdataWithColor;
// }