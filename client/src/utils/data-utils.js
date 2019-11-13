/*
Is a utilities the best place for this?
*/
import axios from 'axios';

var _stateData = {};
var _countyData = {};

export function storeStateData(stateData) {
	let max = 0;
	stateData.forEach(state => {
		max = max < state.state_total ? state.state_total : max;
		_stateData[state.name] = {... state };	// pull out and index by state's name
	});
	_stateData.max = max;
  return JSON.parse(JSON.stringify(_stateData));  // return copy of object
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

function getStateData() {
	return axios.get('/api/totals/')
	.then(res => { console.log(res); return res.data })
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
	return Promise.all([getStateData(), getCountyData()]);
}

const colorBins = [0, 50, 75, 100, 120];
var lockedLayer = null;
var lockedLayerColor = null;

function hashStateColor(sum, max) {
	let colorHashed;

	if(sum < max/5) colorHashed = colorBins[0];
    else if(sum < max/4) colorHashed = colorBins[1];
    else if(sum < max/3) colorHashed = colorBins[2];
    else if(sum < max/2) colorHashed = colorBins[3];
    else if(sum < max + 1) colorHashed = colorBins[4];

	return colorHashed;
}

export function resetStateColor(layer, statesData) {
	const STATE_NAME = layer.feature.properties.NAME;
	const stateData = statesData[STATE_NAME];

	if(!stateData || stateData.state_total <= 0) {
		layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
		return;
	}

	let colorHashed = hashStateColor(stateData.state_total, statesData.max);
    
    layer.setStyle({fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`})
}

export function eachState(feature, layer, statesData, currentState, setStateDisplay) {
	const STATE_NAME = feature.properties.NAME;
	const stateData = statesData[STATE_NAME];
	if(!stateData || stateData.state_total <= 0) {
		layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
		return;
	}
    // const colorHashed = colorBins[Math.floor((5*stateData.state_total-1)/total)];
    let colorHashed = hashStateColor(stateData.state_total, statesData.max);
    layer.on('mouseover', function(event){
	    if(!setStateDisplay(STATE_NAME)) return;  // setStateDisplay() will return false if we're locked onto something else
	    // layer._path.classList.add("show-state");
	    layer.setStyle({fillColor: 'rgb(200, 200, 200)'});
	});
    layer.on('mouseout', function(event){
    	if(!setStateDisplay("none")) return;
    	// layer._path.classList.remove("show-state");
    	layer.setStyle({fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`});
	});
	layer.on('click', function(event) {
		layer.setStyle({fillColor: `rgb(100, 100, 100)`});
		if(lockedLayer) {
			lockedLayer.setStyle({fillColor: `rgb(255, ${lockedLayerColor}, ${lockedLayerColor})`});
			if(lockedLayer === layer) {
				setStateDisplay("none", true);
				lockedLayer = null;
				lockedLayerColor = null;
				return;
			}
		}
		setStateDisplay(STATE_NAME, true);  // true parameter for locking

		lockedLayerColor = 150-colorHashed;
		lockedLayer = layer;
	});
	layer.setStyle({stroke: 1, weight: 1, opacity: 0.75, color: 'white', fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`, fillOpacity: 0.75});
}

export function eachStatesCounties(feature, layer, countytotals, setCountyDisplay, total=33)
{
	if(countytotals[feature.properties.County_state] && countytotals[feature.properties.County_state].state_total > 0) {
    // const colorHashed = colorBins[Math.floor((5*countytotals[feature.properties.County_state].state_total-1)/total)];
    let colorHashed = 0;
    // if(countytotals[feature.properties.County_state].state_total < total/10) colorHashed = colorBins[0];
    // else if(countytotals[feature.properties.County_state].state_total < total/8) colorHashed = colorBins[1];
    // else if(countytotals[feature.properties.County_state].state_total < total/6) colorHashed = colorBins[2];
    // else if(countytotals[feature.properties.County_state].state_total < total/4) colorHashed = colorBins[3];
    // else if(countytotals[feature.properties.County_state].state_total < total + 1) colorHashed = colorBins[4];
    colorHashed = colorBins[0];
    layer.on('mouseover', function(event){
      if(!setCountyDisplay(feature.properties.County_state)) return;  // setCountyDisplay() will return false if we're locked onto something else
      // layer._path.classList.add("show-state");
      layer.setStyle({fillColor: 'rgb(200, 200, 200)'});
  });
    layer.on('mouseout', function(event){
    	if(!setCountyDisplay("none")) return;
      // layer._path.classList.remove("show-state");
      layer.setStyle({fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`});
  });
    layer.on('click', function(event) {
    	layer.setStyle({fillColor: `rgb(100, 100, 100)`});
    	if(lockedLayer) {
    		lockedLayer.setStyle({fillColor: `rgb(255, ${lockedLayerColor}, ${lockedLayerColor})`});
    		if(lockedLayer === layer) {
    			setCountyDisplay("none", true);
    			lockedLayer = null;
    			lockedLayerColor = null;
    			return;
    		}
    	}
      setCountyDisplay(feature.properties.County_state, true);  // true parameter for locking

      lockedLayerColor = 150-colorHashed;
      lockedLayer = layer;
  });
    layer.setStyle({stroke: 1, weight: 1, opacity: 0.75, color: 'white', fillColor: `rgb(255, ${150-colorHashed}, ${150-colorHashed})`, fillOpacity: 0.75});
} else {
	layer.setStyle({color: 'rgba(0, 0, 0, 0)'});
}
}