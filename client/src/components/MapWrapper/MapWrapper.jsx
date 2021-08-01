import React from 'react';
import {
 Map, TileLayer, Rectangle, GeoJSON, Pane,
} from 'react-leaflet';

import './MapWrapper.css';
import { MAP_LOCATIONS as ML } from 'res/values/map';
import { usa } from 'res/geography/usa.js';
import { counties } from 'res/geography/counties/statecounties.js';
import { states_usa } from 'res/geography/states.js';
import { states_alaska } from 'res/geography/alaska.js';
import { states_hawaii } from 'res/geography/hawaii.js';
import {
  eachState,
  eachStatesCounties,
  defaultColors,
  covidColors,
  eachCovidState,
} from 'utils/data-utils';
import { useLocation } from 'react-router-dom';
import Legend from './Legend/Legend';

const months_short = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const monthVals = months_short.map((month) => Date.parse(`${month} 1, 2020`));

// move to map res utils
const usaCentre = [38.0, -96.0];
const usaBounds = [[18.0, -135.0], [52.0, -60.0]];
const alaskaCentre = [64.0, -150.0];
const alaskaBounds = [[34.0, -110.0], [94.0, -190.0]];
const hawaiiCentre = [20.0, -155.0];
const hawaiiBounds = [[0.0, -170.0], [40.0, -135.0]];
const worldBounds = [[-90.0, -180.0], [90.0, 180.0]];

const MapWrapper = (props) => {
  const location = useLocation();
  let theColors;
  let covidFlag;
  if (location.pathname == '/covid') {
    theColors = covidColors;
    covidFlag = 1;
  } else {
    theColors = defaultColors;
    covidFlag = 0;
  }

  return (
    <div id="MapWrapper">
      {props.timeSlider && props.timeSlider}
      <Map
        id="USA"
        ref={props.mapRef}
        maxBounds={ML.worldBounds}
        minZoom={2}
        zoomSnap={0.25}
        center={ML.usaCenter}
        zoom={4.5}
        onZoomend={props.updateZoom}
      >
        <TileLayer
          bounds={ML.worldBounds}
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <Rectangle
          bounds={ML.worldBounds}
          stroke={false}
          fillOpacity="0"
          onClick={() => props.updateState('none', true)}
          // when clicking on rectangle, sets updateState to none without truly ever unlocking the state!
          //
        />
        {!props.covid && (
          <Pane
            name="counties"
            style={{
              zIndex: 500,
              display: props.zoom() >= 6 ? 'block' : 'none',
            }}
          >
            {counties.map((state, index) => (
              <GeoJSON
                key={index}
                data={state}
                onEachFeature={(feature, layer) => eachStatesCounties(
                    feature,
                    layer,
                    props.data,
                    69,
                    props.updateCounty,
                    theColors,
                  )}
              />
            ))}
          </Pane>
        )}
        <Pane
          name="states"
          style={{ zIndex: 500, display: props.zoom() >= 6 ? 'none' : 'block' }}
        >
          <GeoJSON
            ref={props.statesRef}
            data={states_usa}
            onAdd={() => props.updateView(0, 1)}
            onEachFeature={(feature, layer) => (props.covid
                ? eachCovidState(
                    feature,
                    layer,
                    props.data,
                    props.updateState,
                    theColors,
                  )
                : eachState(
                    feature,
                    layer,
                    props.data,
                    props.max,
                    props.updateState,
                    theColors,
                  ))}
          />
          <GeoJSON
            ref={props.alaskaRef}
            data={states_alaska}
            onEachFeature={(feature, layer) => (props.covid
                ? eachCovidState(
                    feature,
                    layer,
                    props.data,
                    props.updateState,
                    theColors,
                  )
                : eachState(
                    feature,
                    layer,
                    props.data,
                    props.max,
                    props.updateState,
                    theColors,
                  ))}
          />
          <GeoJSON
            ref={props.hawaiiRef}
            data={states_hawaii}
            onEachFeature={(feature, layer) => (props.covid
                ? eachCovidState(
                    feature,
                    layer,
                    props.data,
                    props.updateState,
                    theColors,
                  )
                : eachState(
                    feature,
                    layer,
                    props.data,
                    props.max,
                    props.updateState,
                    theColors,
                  ))}
          />
        </Pane>
        <GeoJSON
          data={usa}
          onEachFeature={(feature, layer) => {
            layer.setStyle({
              stroke: 0.3,
              color: '#777777',
              backgroundColor: '#aaaaaa',
            });
          }}
        />
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
// https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png
export default MapWrapper;
