import React, { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, Rectangle, Pane, MapConsumer, Popup, Marker,
} from 'react-leaflet';
import L from 'leaflet'; //eslint-disable-line

import './MapWrapper.css';
import { useLocation } from 'react-router-dom';
import Carousel from 'components/SpotlightModal/Carousel';
import TimeSlider from './TimeSlider/TimeSlider';
import axios from 'axios';
import { MAP_LOCATIONS as ML } from '../../res/values/map';
import { usa } from '../../res/geography/usa';
import { counties } from '../../res/geography/counties/statecounties';
import { states_usa } from '../../res/geography/states';
import {
  counts_aggregateBy,
  hashColor,
  hashCovidColor,
} from '../../utils/data-utils';
import MyGeoJSON from './GeoJSON/MyGeoJSON';

const months_short = [ //eslint-disable-line
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

const usa_background_style = { stroke: 0.3, color: '#777777', backgroundColor: '#aaaaaa' };

const MapWrapper = (props) => {
  const location = useLocation(); //eslint-disable-line

  const [datalen, setdatalen] = useState(props.data.length)

  const calculateStateColor = (state, data, max) => {
    const stateCount = counts_aggregateBy(data, 'state', state);
    if (stateCount <= 0) {
      return 'rgba(0, 0, 0, 0)';
    }
    return hashColor(stateCount, max);
  };

  const calculateCountyColor = (county, data, max) => {
    const countyCount = counts_aggregateBy(data, 'county', county);
    if (countyCount <= 0) {
      return 'rgba(0, 0, 0, 0)';
    }
    return hashColor(countyCount, max);
  };

  useEffect(() => {
    if (!props.covid) {
      states_usa.features.forEach((eachStateArg) => eachStateArg.properties.COLOR = calculateStateColor(eachStateArg.properties.NAME, props.data, props.max));
      counties.forEach((countiesInState) => countiesInState.features.forEach((eachCounty) => eachCounty.properties.COLOR = calculateCountyColor(eachCounty.properties.County_state, props.data, props.maxCounty)));
    } else {
      states_usa.features.forEach((eachStateArg) => eachStateArg.properties.COLOR = props.data[eachStateArg.properties.NAME] ? hashCovidColor(props.data[eachStateArg.properties.NAME].count, props.max) : 'rgb(0,0,0)');
    }

    setdatalen(props.data.length)
    return () => { };
  }, [props.data.length]); // pretty good indicator of when we should recalculate colors? Could be an edge case where # elements are the same - huge edge case with changing the published

  let lockedLayer;

  return (
    <div id="MapWrapper">
      {!props.covid &&
        <TimeSlider
          filterTime={props.timeSliderUpdate}
        />
      }
      <MapContainer
        id="USA"
        whenCreated={(map) => {
          props.mapRef.current = map;
        }}
        maxBounds={ML.worldBounds}
        minZoom={2}
        zoomSnap={0.25}
        center={ML.usaCenter}
        zoom={props.zoom()}
        closePopupOnClick
        preferCanvas={props.spotlightOn}
      >
        <TileLayer
          key="base"
          bounds={ML.worldBounds}
          attribution={props.covid ? "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" : "&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors &copy; <a href=&quot;https://carto.com/attributions&quot;>CARTO</a>"}
          url={props.covid ? "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"}
          subdomains="abcd"
        />
        <Rectangle
          bounds={ML.worldBounds}
          stroke={false}
          fillOpacity="0"
        />
        <Pane
          name="states"
          className={props.displayType === 'state' ? '' : 'paneHide'}
        >
          {
          }
          <MyGeoJSON
            key="states"
            style={(feature) => (
              {
              stroke: 0.5, weight: 0.5, color: props.covid ? 'white' : 'black' , fillColor: feature.properties.COLOR, fillOpacity: 1,
            })}
            geojson={states_usa}
            datalen={datalen}
            published={props.publishedChange}
            eventHandlers={{
              mouseover: ({ layer }) => layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)' && props.updateState && props.updateState(layer.feature.properties.NAME) && layer.setStyle({ fillColor: 'rgb(200, 200, 200)' }),
              mouseout: ({ layer }) => layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)' && props.updateState && props.updateState('none', false) && layer.setStyle({ fillColor: layer.feature.properties.COLOR }),
              click: ({ layer }) => {
                if (!props.updateState || layer.feature.properties.COLOR === 'rgba(0, 0, 0, 0)') return;
                props.updateState(layer.feature.properties.NAME, true); // this update state is not resetting to state!!
                if (lockedLayer) {
                  lockedLayer.setStyle({ fillColor: lockedLayer.feature.properties.COLOR });
                  if (lockedLayer === layer) {
                    lockedLayer = null;
                    return;
                  }
                }
                layer.setStyle({ fillColor: 'rgb(100, 100, 100)' });
                lockedLayer = layer;
              },
            }}
          />
        </Pane>
        {!props.covid // if covid map, don't draw county
          && (
            <Pane
              name="counties"
              className={props.displayType === 'county' ? '' : 'paneHide'}
            >
              <MyGeoJSON
                key="counties"
                style={(feature) => ({
                  stroke: 1, weight: 1, color: 'black', fillColor: feature.properties.COLOR, fillOpacity: 1,
                })}
                geojson={counties}
                datalen={datalen}
                published={props.publishedChange}
                eventHandlers={{
                  mouseover: ({ layer }) => layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)' && props.updateCounty && props.updateCounty(layer.feature.properties.County_state) && layer.setStyle({ fillColor: 'rgb(200, 200, 200)' }),
                  mouseout: ({ layer }) => layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)' && props.updateCounty && props.updateCounty('none') && layer.setStyle({ fillColor: layer.feature.properties.COLOR }),
                  click: ({ layer }) => {
                    if (!props.updateCounty || layer.feature.properties.COLOR === 'rgba(0, 0, 0, 0)') return;
                    props.updateCounty(layer.feature.properties.County_state, true, true);
                    if (lockedLayer) {
                      lockedLayer.setStyle({ fillColor: lockedLayer.feature.properties.COLOR });
                      if (lockedLayer === layer) {
                        lockedLayer = null;
                        return;
                      }
                    }
                    layer.setStyle({ fillColor: 'rgb(100, 100, 100)' });
                    lockedLayer = layer;
                  },
                }}
              />
            </Pane>
          )}
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
