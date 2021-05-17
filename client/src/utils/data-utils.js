import axios from 'axios';

// TODO get rid of state
var _stateData = {};
var _countyData = {};

const STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
"District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
"Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
"Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
"Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
"Texas", "Utah", "United States Virgin Islands", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Puerto Rico"]

export const covidColors = ["#fed98e","#fed98e","#fe9929","#d95f0e","#993404"] // made the first two the same since the second bin isnt used ffffd4 was the original
export const defaultColors = ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"]

async function getStateStructure() {
	let groups = await axios.get('/api/totals/groups')
	// {key: "", name: "", }

	let stateData = {}
	STATES.forEach(state => {
		stateData[state] = { count: 0 }
		function groupToCounts(groups, arr){
			return groups.map(eachGroup => {
	      	  arr[eachGroup.name] = { count: 0 }
		      if(eachGroup.children.length > 0) {
		      	arr[eachGroup.name].children = {}
		        groupToCounts(eachGroup.children, arr[eachGroup.name].children);
		      }
		    });
		};
		groupToCounts(groups.data.ret, stateData[state])
	})



	return stateData
}

function storeStateDataReports(data) {
	let stateData = {}
	STATES.forEach(state => {
		stateData[state] = { count: 0, children: [] }
	})

	data.forEach(report => {
		if (stateData[report.state]) {
			if (!report.link || !report.link.includes("http")) report.link = "";
			if (!report.date) report.date = "Unknown";
			stateData[report.state].children.push(report);
		}
	})

	let max = 0
	Object.keys(stateData).forEach(state => {
		stateData[state].count = stateData[state].children.length
		if (stateData[state].count > max) {
			max = stateData[state].count
		}
	})
	stateData.max = max



	return stateData
}

export function filterPublishedReports(data) {
	let newData = {}
	STATES.forEach(state => {
		newData[state] = { count: 0, children: [] }
	})

	let newMax = 0;
	Object.keys(newData).forEach(state => {
		if(data[state] instanceof Object) {
			newData[state].children = data[state].children.filter(e => e.published);
			newData[state].count = newData[state].children.length;
			if (newData[state].count > newMax) newMax = newData[state].count;
		}
	})
	newData.max = newMax;
	return newData;
}

export function storeStateData(data, start) {
	// `/api/totals/` returns: {name, parent, group, count}[]

	// let maxGroup = 0;
	let stateData = start
	// secondary groups. does not work for deeper nested groups yet
	data.forEach(state_group => {
		let { name, parent, group, count } = state_group;
		// we want to remove this if statement, the StateStructure should exactly reflect the data
		if(stateData[name][parent].children[group]) // skip those whose groups don't match with that incident's primary group
		{
			count = parseInt(count)
			stateData[name][parent].children[group].count = count
			stateData[name].count += count
		}
	}) 

	let maxState = 0;

	// aggregate primary groups' counts
	for (let key in stateData) {
		let state = stateData[key]
		if (state.count > maxState) maxState = state.count; // max total of all states, for coloring
		for (let parent in state) {
			if (!(state[parent] instanceof Object)) continue; // not a parent
			state[parent].count = Object.values(state[parent].children).reduce((a, b) => ({count: a.count + b.count}), ({count: 0})).count
		}
	}


	stateData.max = maxState;
	return JSON.parse(JSON.stringify(stateData));  // return copy of object
}

export function storeCountyData(countyData) {
	let max = 0;
	countyData.forEach(county => {
		max = max < county.county_total ? county.county_total : max;
		_countyData[county.county_state] = {... county };
	});
	_countyData.max = max;
	return _countyData;
}

export function counts_total(data) {
	return data.reduce((a,b) => a+b.count, 0);
}

// Issue with these "max" is we need all the values to iterate over, so we can't generalize easily
export function counts_maxPrimary(data) {
	let fields = ["Race/Ethnicity", "Religion", "Gender/Sexuality", "Miscellaneous"];
	return Math.max(...fields.map(field => counts_aggregateBy(data, 'primary_reason', field)))
}

export function counts_maxState(data) {
	let fields = STATES;
	return Math.max(...fields.map(field => counts_aggregateBy(data, 'state', field)))
}

export function counts_aggregateBy(data, field, value) {
	return data.filter(part => part[field]==value).reduce((a,b) => a+b.count, 0);
}

export function counts_aggregateByAll(data, fieldValues) {
	return data.filter(part => fieldValues.every(fv => part[fv[0]]==fv[1])).reduce((a,b) => a+b.count, 0);
}

export function counts_aggregateRange(data, field, low, high) {
	return data.filter(part => part[field] >= low && part[field] <= high).reduce((a,b) => a+b.count, 0);
}

export function getDataCounts() {
	return axios.get('/api/totals/')
	.then(res => res.data.result)
	.catch((err) => {
		alert(`API call failed: ${err}`);
		return {};
	});
}

export function getStateDataReports() {
	return axios.get('/api/totals/reports')
	.then(res => { return storeStateDataReports(res.data.result) })
	.catch((err) => {
		alert(`API call failed: ${err}`);
		return {};
	});
}

function getStateData() {
	return axios.get('/api/totals/')
	.then(res => {  return res.data })
	.catch((err) => {
		alert(`API call failed: ${err}`);
		return {};
	});
}

function getPublishedStateData() {
	return axios.get('/api/totals/published')
	.then(res => {  return res.data })
	.catch((err) => {
		alert(`API call failed: ${err}`);
		return {};
	});
}

function getCountyData() {  // TODO: Lazy load?
	return axios.get('/api/maps/countydata')
	.then(res => { return res.data })
	.catch((err) => {
		alert(`API call failed: ${err}`);
		return {};
	});
}

export async function getAllData() {
	return Promise.all([getStateDataReports(), getPublishedStateData(), getStateStructure()]); // TODO: remove once we get county data working
	return Promise.all([getStateData(), getCountyData()]);
}

function formatCovidData(data) {
	let stateData = {}
	STATES.forEach(state => {
		stateData[state] = { count: 0, children: [] }
	})

	data.forEach(report => {
		if (stateData[report.state]) {
			if (!report.link.includes("http")) report.link = "";
			stateData[report.state].children.push(report);
			if (report.description){
				const description = report.description 
				// console.log(description)
				
			}
		}

	})

	let max = 0
	Object.keys(stateData).forEach(state => {
		stateData[state].count = stateData[state].children.length
		if (stateData[state].count > max) {
			max = stateData[state].count
		}
	})



	stateData.max = max
	// const wordData = ['test']
	// const stateData = stateData
	// console.log(stateData)
	return stateData
}

export async function getCovidData() {
	return axios.get('/api/totals/covid')
	.then(res => {  return formatCovidData(res.data.result) })
	.catch((err) => {
		alert(`API call failed: ${err}`);
		return {};
	});
}

const colorBins = ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"];
var lockedLayer = null;
var lockedLayerColor = null;

function hashStateColor(sum, max,colorBins) {
	let colorHashed;
	if(sum < max/10) colorHashed = colorBins[0];
    else if(sum < max/8) colorHashed = colorBins[1];
    else if(sum < max/5) colorHashed = colorBins[2];
    else if(sum < max/3) colorHashed = colorBins[3];
    else if(sum < max + 1) colorHashed = colorBins[4];

	return colorHashed;
}

export function resetStateColor(layer, statesData,colorBins) {
	const STATE_NAME = layer.feature.properties.NAME;
	if(!STATE_NAME) return;
	const stateData = statesData[STATE_NAME];

	if(!stateData || stateData.total <= 0) {
		layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
		return;
	}

	let colorHashed = hashStateColor(stateData.count, statesData.max,colorBins);
    
    layer.setStyle({fillColor: colorHashed})
}

export function eachCovidState(feature, layer, statesData, setStateDisplay, colorBins) {
	const STATE_NAME = feature.properties.NAME;
	const stateData = statesData[STATE_NAME];
	if(!stateData || stateData.count <= 0) {
		layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
		return;
	}
    // const colorHashed = colorBins[Math.floor((5*stateData.total-1)/total)];
	let colorHashed = hashStateColor(stateData.count, statesData.max,colorBins);
    layer.on('mouseover', function(event){
	    if(!setStateDisplay(STATE_NAME)) return;  // setStateDisplay() will return false if we're locked onto something else
	    // layer._path.classList.add("show-state");
	    layer.setStyle({fillColor: 'rgb(200, 200, 200)'});
	});
    layer.on('mouseout', function(event){
    	if(!setStateDisplay("none")) return;
    	// layer._path.classList.remove("show-state");
    	layer.setStyle({fillColor: colorHashed});
	});
	layer.on('click', function(event) {
		layer.setStyle({fillColor: `rgb(100, 100, 100)`});
		if(lockedLayer) {
			lockedLayer.setStyle({fillColor: lockedLayerColor});
			if(lockedLayer === layer) {
				setStateDisplay("none", true);
				lockedLayer = null;
				lockedLayerColor = null;
				return;
			}
		}
		setStateDisplay(STATE_NAME, true);  // true parameter for locking

		lockedLayer = layer;
		lockedLayerColor = colorHashed;
	});
	layer.setStyle({stroke: 1, weight: 1, opacity: 0.75, color: 'white', fillColor: colorHashed, fillOpacity: 0.75});
}

export function eachState(feature, layer, data, max, setStateDisplay, colorBins) {
	const STATE_NAME = feature.properties.NAME;
	const stateCount = counts_aggregateBy(data, 'state', STATE_NAME);
	if(stateCount <= 0) {
		layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
		return;
	}
    // const colorHashed = colorBins[Math.floor((5*stateData.total-1)/total)];
	let colorHashed = hashStateColor(stateCount, max, colorBins);
    layer.on('mouseover', function(event){
	    if(!setStateDisplay(STATE_NAME)) return;  // setStateDisplay() will return false if we're locked onto something else
	    // layer._path.classList.add("show-state");
	    layer.setStyle({fillColor: 'rgb(200, 200, 200)'});
	});
    layer.on('mouseout', function(event){
    	if(!setStateDisplay("none")) return;
    	// layer._path.classList.remove("show-state");
    	layer.setStyle({fillColor: colorHashed});
	});
	layer.on('click', function(event) {
		layer.setStyle({fillColor: `rgb(100, 100, 100)`});
		if(lockedLayer) {
			lockedLayer.setStyle({fillColor: lockedLayerColor});
			if(lockedLayer === layer) {
				setStateDisplay("none", true);
				lockedLayer = null;
				lockedLayerColor = null;
				return;
			}
		}
		setStateDisplay(STATE_NAME, true);  // true parameter for locking

		lockedLayer = layer;
		lockedLayerColor = colorHashed;
	});
	layer.setStyle({stroke: 1, weight: 1, opacity: 0.75, color: 'white', fillColor: colorHashed, fillOpacity: 0.75});
}

export function eachStatesCounties(feature, layer, data, max, setCountyDisplay, colorBins)
{
	const COUNTY_NAME = feature.properties.NAME;
	const STATE_FP = feature.properties.STATEFP;
	const countyCount = counts_aggregateBy(data, 'county', COUNTY_NAME + ',' + STATE_FP);
	if(countyCount <= 0) {
		layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
		return;
	}
    // const colorHashed = colorBins[Math.floor((5*countytotals[feature.properties.County_state].total-1)/total)];
    let colorHashed = 0;
    if(countyCount < max/10) colorHashed = colorBins[0];
    else if(countyCount < max/8) colorHashed = colorBins[1];
    else if(countyCount < max/6) colorHashed = colorBins[2];
    else if(countyCount < max/4) colorHashed = colorBins[3];
    else if(countyCount < max + 1) colorHashed = colorBins[4];
    //colorHashed = colorBins[0];
    layer.on('mouseover', function(event){
	      if(!setCountyDisplay(feature.properties.County_state)) return;  // setCountyDisplay() will return false if we're locked onto something else
	      // layer._path.classList.add("show-state");
	      layer.setStyle({fillColor: 'rgb(200, 200, 200)'});
	  });
	    layer.on('mouseout', function(event){
	    	if(!setCountyDisplay("none")) return;
	      // layer._path.classList.remove("show-state");
	      layer.setStyle({fillColor: colorHashed});
	  });
	    layer.on('click', function(event) {
	    	layer.setStyle({fillColor: `rgb(100, 100, 100)`});
	    	if(lockedLayer) {
	    		lockedLayer.setStyle({fillColor: lockedLayerColor});
	    		if(lockedLayer === layer) {
	    			setCountyDisplay("none", true);
	    			lockedLayer = null;
	    			lockedLayerColor = null;
	    			return;
	    		}
	    	}
	      setCountyDisplay(feature.properties.County_state, true);  // true parameter for locking

	      lockedLayer = layer;
	  });
    layer.setStyle({stroke: 0.1, weight: 1, opacity: 0.75, color: 'black', fillColor: colorHashed, fillOpacity: 0.75});
}