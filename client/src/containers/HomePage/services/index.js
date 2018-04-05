const currentLayers = new Set();
const storedLayers = {};

const filteringOptions = {
  notVerified: {
    customFilter: ({ verified }) => Number(verified) < 1,
    color: 'red',
  },
  verified1: {
    customFilter: ({ verified }) => Number(verified) === 1,
    color: '#DFCFBE',
  },
  verified2: {
    customFilter: ({ verified }) => Number(verified) > 1,
    color: '#55B4B0',
  },
  women: {
    customFilter: ({ groupharassed }) => groupharassed === 'Women',
    color: '#E15D44',
  },
  hispanic: {
    customFilter: ({ groupharassed }) => groupharassed === 'Hispanic' || groupharassed === 'Hispanic/Latino',
    color: '#7FCDCD',
  },
  africanAmerican: {
    customFilter: ({ groupharassed }) => groupharassed === 'African American',
    color: '#BC243C',
  },
};

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
  const mapdata = [];
  currentLayers.forEach((layer) => {
    const { customFilter, color } = filteringOptions[layer];
    const filteredData = storedLayers.allpoints
      .filter(point => customFilter(point))
      .map(point => Object.assign({ color }, point));
    mapdata.push(...filteredData);
  });
  return removeDuplicates(mapdata);
}
