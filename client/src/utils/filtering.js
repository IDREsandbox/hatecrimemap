const filteringMethods = [
  {
    label: 'Verified',
    name: 'verified',
  },
  {
    label: 'African American',
    name: 'africanAmerican',
  },
  {
    label: 'Arab',
    name: 'arab',
  },
  {
    label: 'Asian American',
    name: 'asianAmerican',
  },
  {
    label: 'Disabled',
    name: 'disabled',
  },
  {
    label: 'Hispanic / Latino',
    name: 'hispanicLatino',
  },
  {
    label: 'Jewish',
    name: 'jewish',
  },
  {
    label: 'LGBT',
    name: 'lgbt',
  },
  {
    label: 'Muslim',
    name: 'muslim',
  },
  {
    label: 'Native American / American Indian / Alaska Native',
    name: 'nativeAmerican',
  },
  {
    label: 'Pacific Islander',
    name: 'pacificIslander',
  },
  {
    label: 'Sikh',
    name: 'sikh',
  },
  {
    label: 'Trump Supporter',
    name: 'trumpSupporter',
  },
  {
    label: 'White',
    name: 'white',
  },
  {
    label: 'Women',
    name: 'women',
  },
  {
    label: 'Girls',
    name: 'girls',
  },
  {
    label: 'Men',
    name: 'men',
  },
  {
    label: 'Boys',
    name: 'boys',
  },
];

// Keys required for React component
let key = 0;
filteringMethods.forEach(method => method.key = key++);

export default filteringMethods;

const currentLayers = new Set();
const storedLayers = {};

const filteringOptions = {
  verified: {
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
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
