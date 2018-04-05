// Group Harassed Filters

const ghFilters = [
  {
    label: 'Verified',
    name: 'verified',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'African American',
    name: 'africanAmerican',
    customFilter: ({ groupharassed }) => groupharassed === 'African American',
    color: 'red',
  },
  {
    label: 'Arab',
    name: 'arab',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Asian American',
    name: 'asianAmerican',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Disabled',
    name: 'disabled',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Hispanic / Latino',
    name: 'hispanicLatino',
    customFilter: ({ groupharassed }) => groupharassed === 'Hispanic' || groupharassed === 'Hispanic/Latino',
    color: 'red',
  },
  {
    label: 'Jewish',
    name: 'jewish',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'LGBT',
    name: 'lgbt',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Muslim',
    name: 'muslim',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Native American / American Indian / Alaska Native',
    name: 'nativeAmerican',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Pacific Islander',
    name: 'pacificIslander',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Sikh',
    name: 'sikh',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Trump Supporter',
    name: 'trumpSupporter',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'White',
    name: 'white',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Women',
    name: 'women',
    customFilter: ({ groupharassed }) => groupharassed === 'Women',
    color: 'red',
  },
  {
    label: 'Girls',
    name: 'girls',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Men',
    name: 'men',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
  {
    label: 'Boys',
    name: 'boys',
    customFilter: ({ verified }) => Number(verified) > 0,
    color: 'red',
  },
];

// React component requires keys
let key = 0;
ghFilters.forEach(filter => filter.key = key++);

export default ghFilters;
