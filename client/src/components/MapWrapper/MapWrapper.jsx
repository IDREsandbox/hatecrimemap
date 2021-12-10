import React, { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, Rectangle, Pane, MapConsumer, Popup, Marker,
} from 'react-leaflet';
import L from 'leaflet'; //eslint-disable-line

import Floater from 'react-floater';

import './MapWrapper.css';
import { useLocation } from 'react-router-dom';
import Carousel from 'components/SpotlightModal/Carousel';
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

/*
keeping as legacy - could be used as example for Date library
const monthVals = months_short.map((month) => Date.parse(`${month} 1, 2020`));
*/

const usa_background_style = { stroke: 0.3, color: '#777777', backgroundColor: '#aaaaaa' };

const MapWrapper = (props) => {
  const location = useLocation(); //eslint-disable-line

  const [carouselData, setCarouselData] = useState({
    data: {},
  });

  const [lockItem, setLockItem] = useState(props.lockItem);
  const [lockType, setLockType] = useState(props.lockType);

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

    return () => { };
  }, [props.data.length]); // pretty good indicator of when we should recalculate colors? Could be an edge case where # elements are the same

  let lockedLayer;

  useEffect(() => {
    // this is causing an extra call to API without the need?
    let lockTypeQuery;
    if (lockItem === 'none') {
      lockTypeQuery = 'none';
    } else {
      lockTypeQuery = lockType;
    }

    axios.get(`/api/stories/${lockTypeQuery}/${lockItem}`)
      .then((res) => {
        if (carouselData.data[lockItem]) {
          // do nothing, data already exists
        } else {
          setCarouselData((prevState) => ({
            data: {
              ...prevState.data,
              [lockItem]: res.data,
            },
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div id="MapWrapper">
      {props.timeSlider}
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
      >
        <TileLayer
          key="base"
          bounds={ML.worldBounds}
          attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors &copy; <a href=&quot;https://carto.com/attributions&quot;>CARTO</a>"
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <Rectangle
          bounds={ML.worldBounds}
          stroke={false}
          fillOpacity="0"
          onClick={() => props.updateState('none', true)} // Doesn't work anymore, seems like rectangle onClick was outdated in react-leaflet
        />
        <Pane
          name="states"
          className={props.displayType === 'state' ? '' : 'paneHide'}
        >
          {
          }
          <MyGeoJSON
            key="states"
            style={(feature) => ({
              stroke: 0.5, weight: 0.5, color: 'black', fillColor: feature.properties.COLOR, fillOpacity: 1,
            })}
            geojson={states_usa}
            datalen={props.data.length}
            eventHandlers={{
              mouseover: ({ layer }) => props.updateState && props.updateState(layer.feature.properties.NAME) && layer.setStyle({ fillColor: 'rgb(200, 200, 200)' }),
              mouseout: ({ layer }) => props.updateState && props.updateState('none', false) && layer.setStyle({ fillColor: layer.feature.properties.COLOR }),
              click: ({ layer }) => {
                if (!props.updateState) return;
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
          {carouselData.data[lockItem] && false
            && (
            <Popup
              className="my-popup"
              position={[34.0522, -118.2437]}
              pane="states"
            >
              <Carousel
                lockItem={lockItem}
                lockType={lockType}
                data={carouselData.data[lockItem]}
              />
            </Popup>
            )}
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
                datalen={props.data.length}
                eventHandlers={{
                  mouseover: ({ layer }) => layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)' && props.updateCounty && props.updateCounty(layer.feature.properties.County_state) && layer.setStyle({ fillColor: 'rgb(200, 200, 200)' }),
                  mouseout: ({ layer }) => layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)' && props.updateCounty && props.updateCounty('none') && layer.setStyle({ fillColor: layer.feature.properties.COLOR }),
                  click: ({ layer }) => {
                    console.log(layer);
                    if (!props.updateCounty || layer.feature.properties.COLOR !== 'rgba(0, 0, 0, 0)') return;
                    props.updateCounty(layer.feature.properties.County_state, true);
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
        <Marker position={[37.7, -122.24584]} />
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
