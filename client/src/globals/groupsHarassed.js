import { camelize } from '../utils/utilities';

// DON'T put more than 1 level of sub_groups. We only drill down charts at most twice
const groupsHarassed = {
	race_ethnicity: [
		{ label: "Jewish" },
		{ label: "African American" },
		{ label: "Asian American",
			sub_groups: [
				{ label: "Japanese American" }
			]},
		{ label: "Latinx" },
		{ label: "Native America/Indigenous" },
		{ label: "White" },
		{ label: "Arab" },
		{ label: "Chinese" }
	],
	religion: [
		{ label: "Muslim" },
		{ label: "Sikh" }
	],
	gender: [
		{ label: "LGBTQ+" },
		{ label: "Male" },
		{ label: "Female" },
		{ label: "Non-Binary" }
	],
	other: [
		{ label: "Trump Supporter" },
		{ label: "Clinton Supporter" },
		{ label: "Immigrant" },
		{ label: "Disabled" }
		// specify your own
	]
}

// flattener by category for DB use
// flattener to array for DB use and filtering (report page, utilities)

let key = 0;
Object.keys(groupsHarassed).forEach(target => {
	groupsHarassed[target].forEach((group) => {
	  group.key = key++;
	  group.name = camelize(group.label);
	  if (group.sub_groups) {
	  	group.sub_groups.forEach((subgroup) => {
	  		  subgroup.key = key++;
			  subgroup.name = camelize(subgroup.label);
	  	});
	  }
	});
});
console.log(groupsHarassed);
export default groupsHarassed