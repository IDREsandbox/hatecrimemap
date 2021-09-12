import React, { useState, useEffect, useRef } from 'react';
import {
 MapContainer, TileLayer, Rectangle, GeoJSON, Pane, MapConsumer, LayerGroup
} from 'react-leaflet';
import L from 'leaflet';

import './MapWrapper.css';
import { MAP_LOCATIONS as ML } from 'res/values/map';
import { usa } from 'res/geography/usa.js';
import { counties } from 'res/geography/counties/statecounties.js';
import { states_usa } from 'res/geography/states.js';
import {
  eachState,
  eachStatesCounties,
  defaultColors,
  covidColors,
  eachCovidState,
  counts_aggregateBy,
  hashColor,
  hashCovidColor
} from 'utils/data-utils';
import { useLocation } from 'react-router-dom';
import MyGeoJSON from './GeoJSON/MyGeoJSON';

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
const worldBounds = [[-90.0, -180.0], [90.0, 180.0]];

const usa_background_style = {stroke: 0.3, color: '#777777', backgroundColor: '#aaaaaa'};

const MapWrapper = (props) => {
  const location = useLocation();

  const calculateStateColor = (state, data, max) => {
      const stateCount = counts_aggregateBy(data, 'state', state);
      if(stateCount <= 0) {
        return 'rgba(0, 0, 0, 0)';
      }
      return hashColor(stateCount, max);
  }

  const calculateCountyColor = (county, data, max) => {
      const countyCount = counts_aggregateBy(data, 'county', county);
      if(countyCount <= 0) {
        return 'rgba(0, 0, 0, 0)';
      }
      return hashColor(countyCount, max);
  }

  useEffect(() => {
    if (!props.covid) {
      states_usa.features.forEach(eachState => eachState.properties.COLOR = calculateStateColor(eachState.properties.NAME, props.data, props.max));
      counties.forEach(countiesInState =>
        countiesInState.features.forEach(eachCounty =>
          eachCounty.properties.COLOR = calculateCountyColor(eachCounty.properties.County_state, props.data, props.maxCounty)
          )
        );
    } else {
      states_usa.features.forEach(eachState => eachState.properties.COLOR = props.data[eachState.properties.NAME] ? hashCovidColor(props.data[eachState.properties.NAME].count, props.max) : 'rgb(0,0,0)');
    }
    return () => { };
  }, [props.data.length]) // pretty good indicator of when we should recalculate colors? Could be an edge case where # elements are the same

  let lockedLayer;

  return (
    <div id="MapWrapper">
      {props.timeSlider}
      <MapContainer
        id="USA"
        whenCreated={map => props.mapRef.current = map}
        maxBounds={ML.worldBounds}
        minZoom={2}
        zoomSnap={0.25}
        center={ML.usaCenter}
        zoom={props.zoom()}
      >
        <TileLayer
          key="base"
          bounds={ML.worldBounds}
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <Rectangle
          bounds={ML.worldBounds}
          stroke={false}
          fillOpacity="0"
          onClick={() => props.updateState('none', true)}
        />
        <Pane
          name='states'
          className={props.displayType === 'state' ? '' : 'paneHide'}>
          <MyGeoJSON
            key='states'
            style={(feature) => ({stroke: 1, weight: 1, opacity: 0.75, color: 'white', fillColor: feature.properties.COLOR, fillOpacity: 0.75})}
            geojson={states_usa}
            datalen={props.data.length}
            eventHandlers={{
              mouseover: ({layer}) => props.updateState && props.updateState(layer.feature.properties.NAME) && layer.setStyle({fillColor: 'rgb(200, 200, 200)'}),
              mouseout: ({layer}) => props.updateState && props.updateState('none') && layer.setStyle({fillColor: layer.feature.properties.COLOR}),
              click: ({layer}) => {
                if (!props.updateState) return;
                props.updateState(layer.feature.properties.NAME, true);
                if (lockedLayer) {
                  lockedLayer.setStyle({fillColor: lockedLayer.feature.properties.COLOR});
                  if (lockedLayer === layer) {
                    lockedLayer = null;
                    return;
                  }
                }
                layer.setStyle({fillColor: 'rgb(100, 100, 100)'});
                lockedLayer = layer;
              }
            }}
          />
        </Pane>
        {!props.covid &&
        <Pane
          name='counties'
          className={props.displayType === 'county' ? '' : 'paneHide'}>
          <MyGeoJSON
            key='counties'
            style={(feature) => ({stroke: 1, weight: 1, opacity: 0.75, color: 'white', fillColor: feature.properties.COLOR, fillOpacity: 0.75})}
            geojson={counties}
            datalen={props.data.length}
            eventHandlers={{
              mouseover: ({layer}) => props.updateCounty && props.updateCounty(layer.feature.properties.County_state) && layer.setStyle({fillColor: 'rgb(200, 200, 200)'}),
              mouseout: ({layer}) => props.updateCounty && props.updateCounty('none') && layer.setStyle({fillColor: layer.feature.properties.COLOR}),
              click: ({layer}) => {
                if (!props.updateCounty) return;
                props.updateCounty(layer.feature.properties.County_state, true);
                if (lockedLayer) {
                  lockedLayer.setStyle({fillColor: lockedLayer.feature.properties.COLOR});
                  if (lockedLayer === layer) {
                    lockedLayer = null;
                    return;
                  }
                }
                layer.setStyle({fillColor: 'rgb(100, 100, 100)'});
                lockedLayer = layer;
              }
            }}
          />
        </Pane>
        }
        <MyGeoJSON
          key="usa"
          geojson={usa}
          style={usa_background_style}
        />
        <MapConsumer>
          {props.controls}
        </MapConsumer>
        {props.children}
      </MapContainer>
    </div>
  );
};

MapWrapper.propTypes = {
  // mapdata: PropTypes.arrayOf(PropTypes.object).isRequired,
  // zoom: PropTypes.function.isRequired,
};
// https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png

const rerenderWhen = (prevProps, props) => prevProps.displayType === props.displayType && prevProps.data.length === props.data.length;
export default React.memo(MapWrapper, rerenderWhen);