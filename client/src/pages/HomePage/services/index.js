const currentLayers = new Set();
const storedLayers = {};

function filterNotVerified() {
  const filtered = storedLayers.allpoints.filter(point => point.verified < 1);
  return filtered;
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
  return filterNotVerified();
}
