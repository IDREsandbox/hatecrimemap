import React, { useState, useEffect } from 'react';
import { Map, TileLayer, MapControl } from 'react-leaflet';
import { Rectangle, GeoJSON, Pane } from 'react-leaflet';
import Legend from './Legend/Legend';
import './MapWrapper.css';
import { MAP_LOCATIONS as ML } from 'res/values/map';
import { usa } from 'res/geography/usa.js';
import { counties } from 'res/geography/counties/statecounties.js';
import { states_usa } from 'res/geography/states.js';
import { states_alaska } from 'res/geography/alaska.js';
import { states_hawaii } from 'res/geography/hawaii.js';
import { eachState, eachStatesCounties,defaultColors,covidColors, eachCovidState } from 'utils/data-utils';
import { useLocation } from 'react-router-dom';



function timestamp(str) {
    return new Date(str).getTime();
}
const years = ["2020", "2021"];
const months_short = [
    "Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"
];
const monthVals = months_short.map(month=>Date.parse(month+" 1, 2020"))


// move to map res utils
const usaCentre = [38., -96.], usaBounds = [[18., -135.], [52., -60.]];
const alaskaCentre = [64., -150.], alaskaBounds = [[34., -110.], [94., -190.]];
const hawaiiCentre = [20., -155.], hawaiiBounds = [[0., -170.], [40., -135.]];
const worldBounds = [[-90., -180.], [90., 180.]]

const MapWrapper = (props) => {
  const location = useLocation();
  let theColors;
  let covidFlag;
  if (location.pathname=="/covid") {
    theColors = covidColors;
    covidFlag = 1
  }
  else{
    theColors = defaultColors;
    covidFlag = 0
  }

  return (
    <div id="MapWrapper">
      {props.timeSlider && props.timeSlider}
      <Map id="USA" ref={props.mapRef} maxBounds={ML.worldBounds} minZoom={2} zoomSnap={0.25} center={ML.usaCenter} zoom={4.5} onZoomend={props.updateZoom}>
        <TileLayer bounds={ML.worldBounds} attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
          <Rectangle bounds={ML.worldBounds} stroke={false} fillOpacity="0" onClick={() => props.updateState("none", true)} />
          {!props.covid && <Pane name="counties" style={{ zIndex: 500, display: (props.zoom() >= 6 ? 'block': 'none') }}>
            { counties.map((state, index) => <GeoJSON key={index} data={state} onEachFeature={(feature, layer) => eachStatesCounties(feature, layer, props.data, 69, props.updateCounty, theColors)} /> ) }
          </Pane>}
          <Pane name="states" style={{ zIndex: 500, display: (props.zoom() >= 6 ? 'none': 'block') }}>
            <GeoJSON ref={props.statesRef} data={states_usa} onAdd={() => props.updateView(0, 1)} onEachFeature={(feature, layer) => props.covid ? eachCovidState(feature, layer, props.data, props.updateState, theColors) : eachState(feature, layer, props.data, props.max, props.updateState, theColors)} />
            <GeoJSON ref={props.alaskaRef} data={states_alaska} onEachFeature={(feature, layer) => props.covid ? eachCovidState(feature, layer, props.data, props.updateState, theColors) : eachState(feature, layer, props.data, props.max, props.updateState, theColors)} />
            <GeoJSON ref={props.hawaiiRef} data={states_hawaii} onEachFeature={(feature, layer) => props.covid ? eachCovidState(feature, layer, props.data, props.updateState, theColors) : eachState(feature, layer, props.data, props.max, props.updateState, theColors)} />
          </Pane>
          <GeoJSON data={usa} onEachFeature={(feature, layer) => { layer.setStyle({stroke: 0.3, color: '#777777', backgroundColor: '#aaaaaa'})}} />
        <Legend colors={theColors} covid={covidFlag} />
       {props.children}
      </Map> 
    </div>
  );
};



MapWrapper.propTypes = {
  // mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  // zoom: PropTypes.function.isRequired,
};
//https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png
export default MapWrapper;