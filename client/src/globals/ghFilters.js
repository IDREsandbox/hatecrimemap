import { camelize } from '../utils/utilities';

// Group Harassed Filters

/*
Unique groups from hcmdata
0. ""
1. "Abandoned Storefronts"
2. "African American"
3. "Arab"
4. "Asian American"
5. "Boys"
6. "Boys bathroom"
7. "Chinese"
8. "Clinton Supporter"
9. "Disabled"
10. "Diversity Advocates"
11. "Girls"
12. "Immigrants"
13. "Indian"
14. "Interracial couples"
15. "Jewish"
16. "LGBT"
17. "Latinx"
18. "Many groups (Nazi symbols)"
19. "Men"
20. "Muslim"
21. "Native American / American Indian/ Alaska Native"
22. "Pacific Islander"
23. "Refugee community"
24. "Several"
25. "Sikh"
26. "Softball dugout"
27. "South Asian Indian"
28. "Trump Supporter"
29. "University Leaders Promoting Diversity"
30. "Unspecified"
31. "Unspecified people of color"
32. "White"
33. "Women"
34. "Women of Color"
*/

const ghFilters = [
  {
    label: 'African American',
    color: '#00f46c',
  },
  {
    label: 'Arab',
    color: '#e06bc7',
  },
  {
    label: 'Asian American',
    color: '#2f57e1',
  },
  {
    label: 'Disabled',
    color: '#0273e5',
  },
  {
    label: 'Chinese',
    color: '#07e1bd',
  },
  {
    label: 'Latinx',
    color: '#e54f6e',
  },
  {
    label: 'Jewish',
    color: '#34af3e',
  },
  {
    label: 'LGBT',
    color: '#7b9ec8',
  },
  {
    label: 'Muslim',
    color: '#137e6c',
  },
  {
    label: 'Native American / American Indian / Alaska Native',
    color: '#dc640c',
  },
  {
    label: 'Pacific Islander',
    color: '#b8f4a7',
  },
  {
    label: 'Sikh',
    color: '#3624c2',
  },
  {
    label: 'Trump Supporter',
    color: '#f7c947',
  },
  {
    label: 'White',
    color: '#b69dda',
  },
  {
    label: 'Women',
    color: '#ea9615',
  },
  {
    label: 'Girls',
    color: '#779f38',
  },
  {
    label: 'Men',
    color: '#82ac9b',
  },
  {
    label: 'Boys',
    color: '#673901',
  },
];

let key = 0;
ghFilters.forEach((filter) => {
  filter.key = key++;
  filter.name = camelize(filter.label);
});

export default ghFilters;
