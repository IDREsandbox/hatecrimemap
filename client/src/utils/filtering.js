import { arrToObject, camelize } from './utilities';

export function addGroupsHarassedSplit(mapdata) {
  const mapdataWithGroupsSplit = mapdata.map((point) => {
    const groupsharassedsplit = point.groupsharassed.split(',');
    return Object.assign({ groupsharassedsplit }, point);
  });
  return mapdataWithGroupsSplit.slice();
}

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